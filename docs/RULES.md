# Developer Resources & Rules

Essential guidelines for a successful integration.

## 1. UI & Design Guidelines

To pass the compliance review and go live, the application must strictly adhere to the following UI rules.

### 1.1 MMQR Logo

- The MMQR logo must be clearly displayed.
- Do not alter, distort, or tamper with the MMQR logo.

### 1.2 Currency Display

- Display prices using **MMK only**.
- Do not display foreign currencies.

### 1.3 Mandatory Attribution

- Include the following attribution text below the QR code:

  **PAYMENT POWERED BY MYANMARPAY**

### 1.4 QR Integrity

- Do not alter, modify, or tamper with the QR code itself.
- Display the QR code exactly as provided.

### 1.5 Visual Timer

- Include a relevant visual timer set to **15 minutes**.

### 1.6 Download QR

- Provide a functional **Download QR** button that allows the user to download the QR code.

## 2. UX & Flow Guidelines

To ensure a reliable and spam-free checkout experience, follow these behavioral guidelines.

### 2.1 Seamless Return

- After scanning the QR code, when the customer returns to the application, the currently open page in the browser must remain open.
- Do not refresh or reset the page when the customer returns from scanning.

### 2.2 State Caching

- Cache the order and QR code instances so they can be restored and displayed correctly if the page is refreshed.
- A refresh must not lose the active order or its associated QR code.

### 2.3 Strict Re-request Policy

- Do not create a new transaction request unless the user explicitly cancels the active order request.
- Reuse the existing active order and QR code when the user returns to the page or refreshes it.

### 2.4 Spam Prevention

- Prevent duplicate order requests and spam transactions.
- Control browser refresh behavior so refreshing the page does not create a new transaction.
- Ensure that repeated page loads or return visits do not trigger duplicate payment requests.

## 3. Platform & KYC Rules

### 3.1 Fund Holding Restrictions

- Platforms acting as intermediaries must not hold funds on behalf of sub-merchants unless they have a verified Central Bank of Myanmar (CBM) permit.

### 3.2 Mandatory KYC Onboarding

- Shadow onboarding is strictly prohibited.
- Every business entity processing payments must have an officially verified profile to comply with applicable Anti-Money Laundering (AML) requirements.

## 4. Prohibited Uses

MMPay must not be used to facilitate the following activities:

### 4.1 Illegal Goods

- Narcotics or other illegal drugs.
- Weapons.
- Counterfeit goods.
- Stolen intellectual property (IP).

### 4.2 Unregulated Gambling

- Lotteries, sports betting, or casino activities without the required licenses.

### 4.3 Adult Content

- Pornography.
- Explicit streaming.
- Escort services.

### 4.4 Financial Scams

- Pyramid schemes.
- Unregulated cryptocurrency exchanges.

### 4.5 Political & Religious Activities

- Fundraising or donations for political or religious purposes.
- Political merchandise.

## 5. Compliance Checklist

### UI & Design
- [ ] MMQR logo is clearly displayed and unmodified.
- [ ] All displayed prices use MMK only.
- [ ] The text `PAYMENT POWERED BY MYANMARPAY` appears below the QR code.
- [ ] The QR code is displayed without modification.
- [ ] A 15-minute visual timer is present.
- [ ] The Download QR button works.

### UX & Flow
- [ ] Returning from QR scanning does not refresh or reset the current page.
- [ ] The active order and QR code are restored after a page refresh.
- [ ] A new transaction request is created only after the user explicitly cancels the active order request.
- [ ] Refreshes and repeated visits do not create duplicate transactions.

### Platform & KYC
- [ ] The platform does not hold funds for sub-merchants without a verified CBM permit.
- [ ] Every business entity processing payments has an officially verified profile.
- [ ] Shadow onboarding is not used.

### Prohibited Uses
- [ ] The integration does not facilitate prohibited illegal goods, unlicensed gambling, adult content, financial scams, or prohibited political and religious activities.
