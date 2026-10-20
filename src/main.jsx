import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import mmqrLogo from "../images/MMQR_Logo.png";
import "./styles.css";

const ACTIVE_PAYMENT_KEY = "fieldnotes.activePayment.v1";
const PAYMENT_WINDOW_SECONDS = 15 * 60;

function readActivePayment() {
  try {
    const cached = JSON.parse(
      localStorage.getItem(ACTIVE_PAYMENT_KEY) || "null",
    );
    if (cached?.qrImage && cached?.orderId && Number.isFinite(cached.createdAt))
      return cached;
    localStorage.removeItem(ACTIVE_PAYMENT_KEY);
  } catch {
    localStorage.removeItem(ACTIVE_PAYMENT_KEY);
  }
  return null;
}

function Mark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 3 37 12.5v15L20 37 3 27.5v-15L20 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m12 25 8-12 8 12M15 21h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function App() {
  const [payment, setPayment] = useState(readActivePayment);
  const [amount, setAmount] = useState(() =>
    String(readActivePayment()?.amount || 2500),
  );
  const [configured, setConfigured] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_WINDOW_SECONDS);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => setConfigured(data.configured))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!payment) return;
    const update = () =>
      setSecondsLeft(
        Math.max(
          0,
          PAYMENT_WINDOW_SECONDS -
            Math.floor((Date.now() - payment.createdAt) / 1000),
        ),
      );
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [payment]);

  async function createPayment(event) {
    event.preventDefault();
    if (busy || payment) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Payment could not be created.");
      const activePayment = { ...data, createdAt: Date.now() };
      localStorage.setItem(ACTIVE_PAYMENT_KEY, JSON.stringify(activePayment));
      setPayment(activePayment);
    } catch (err) {
      setError(err.message || "Could not reach the local payment server.");
    } finally {
      setBusy(false);
    }
  }

  function cancelPayment() {
    localStorage.removeItem(ACTIVE_PAYMENT_KEY);
    setPayment(null);
    setSecondsLeft(PAYMENT_WINDOW_SECONDS);
    setError("");
  }

  const formattedAmount = Number(amount || 0).toLocaleString();
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <Mark />
          </span>
          <span>
            fieldnotes<span className="brand-period">.</span>
          </span>
        </a>
        <div className="sandbox-pill">
          <span className="pulse" />
          Sandbox environment
        </div>
      </header>
      <section className="layout" id="top">
        <div className="intro">
          <div className="eyebrow">
            <span className="eyebrow-line" />A small checkout demo
          </div>
          <h1>
            Make room
            <br />
            for <em>good ideas.</em>
          </h1>
          <p className="intro-copy">
            A pocket journal for the things you don't want to forget. Try a
            sandbox payment with Myan Myan Pay.
          </p>
          <div
            className="product-art"
            aria-label="Illustration of a green journal"
          >
            <div className="sun-disc" />
            <div className="leaf leaf-one" />
            <div className="leaf leaf-two" />
            <div className="book">
              <div className="book-spine" />
              <div className="book-title">
                FIELD
                <br />
                NOTES<span>VOL. 01</span>
              </div>
              <div className="book-stamp">✳</div>
            </div>
            <div className="art-caption">A place to begin again.</div>
          </div>
          <div className="product-meta">
            <span>Fieldnotes journal</span>
            <span>Recycled paper · 160 pages</span>
          </div>
        </div>
        <section className="checkout" aria-labelledby="checkout-title">
          <div className="checkout-head">
            <div>
              <p className="step-label">Your order</p>
              <h2 id="checkout-title">Checkout</h2>
            </div>
            <span className="lock-icon" aria-label="Secure checkout">
              ♧
            </span>
          </div>
          <div className="order-row">
            <div className="thumb">
              <span className="thumb-book" />
            </div>
            <div className="item-info">
              <strong>Fieldnotes journal</strong>
              <span>Forest green · One size</span>
            </div>
            <span className="item-price">{formattedAmount} MMK</span>
          </div>
          <form onSubmit={createPayment}>
            <label className="field-label" htmlFor="amount">
              Test amount <span>MMK</span>
            </label>
            <div className="amount-field">
              <span>MMK</span>
              <input
                id="amount"
                type="number"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={Boolean(payment)}
              />
              <span className="currency">MMK</span>
            </div>
            <p className="field-hint">
              Choose any whole amount from 100 MMK upward.
            </p>
            <div className="summary">
              <div>
                <span>Subtotal</span>
                <span>{formattedAmount} MMK</span>
              </div>
              <div>
                <span>Delivery</span>
                <span className="free">Free</span>
              </div>
              <div className="total">
                <strong>Total due</strong>
                <strong>
                  {formattedAmount} <small>MMK</small>
                </strong>
              </div>
            </div>
            {!configured && (
              <div className="setup-note">
                <span>i</span>
                <p>
                  Add the sandbox keys from your developer console to{" "}
                  <code>.env</code> to enable payments.
                </p>
              </div>
            )}
            {error && (
              <div className="error-note" role="alert">
                {error}
              </div>
            )}
            <button
              className="pay-button"
              type="submit"
              disabled={busy || !configured || Boolean(payment)}
            >
              {busy ? (
                <>
                  <span className="spinner" />
                  Creating test payment…
                </>
              ) : payment ? (
                <>Active payment in progress</>
              ) : (
                <>
                  Continue to payment <span>→</span>
                </>
              )}
            </button>
          </form>
          {payment && (
            <div className="payment-result" aria-live="polite">
              <div className="result-heading">
                <span className="result-check">✓</span>
                <div>
                  <strong>Scan to pay</strong>
                  <span>Sandbox · {payment.status}</span>
                </div>
              </div>
              <div
                className="qr-timer"
                role="timer"
                aria-label={`${Math.floor(secondsLeft / 60)} minutes ${secondsLeft % 60} seconds remaining`}
              >
                <span className="timer-icon">◷</span>
                {secondsLeft > 0
                  ? `QR expires in ${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`
                  : "QR payment window ended"}
              </div>
              <img className="mmqr-logo" src={mmqrLogo} alt="MMQR" />
              <img
                className="qr-image"
                src={payment.qrImage}
                alt="Sandbox payment QR code"
              />
              <a
                className="download-qr"
                href={payment.qrImage}
                download={`${payment.orderId}-qr.png`}
              >
                Download QR
              </a>
              <p className="mmpay-attribution">PAYMENT POWERED BY MYANMARPay</p>
              <div className="order-reference">
                <span>Order reference</span>
                <code>{payment.orderId}</code>
              </div>
              <p className="scan-hint">
                Open a supported payment app and scan this QR to complete the
                test transaction.
              </p>
              <button
                className="cancel-payment"
                type="button"
                onClick={cancelPayment}
              >
                Cancel active payment
              </button>
            </div>
          )}
          <div className="payment-footer">
            <span>
              Powered by <strong>Myan Myan Pay</strong>
            </span>
            <span className="footer-lock">◇ Encrypted checkout</span>
          </div>
        </section>
      </section>
      <footer className="site-footer">
        <span>FIELDNOTES® · PAYMENT TEST STORE</span>
        <span>No real money is charged in sandbox mode.</span>
      </footer>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
