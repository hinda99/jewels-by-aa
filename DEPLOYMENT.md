# Production Deployment Guide — Jewels by A&A

Complete step-by-step instructions to deploy **Jewels by A&A** to Vercel Pro, configure Google Cloud Service Account credentials for live catalog syncing, and verify production health.

---

## 1. Google Cloud Service Account Setup

To connect live Google Sheets as your catalog CMS:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Google Cloud Project named `jewels-by-aa-catalog`.
3. Navigate to **APIs & Services** $\rightarrow$ **Library** and enable the **Google Sheets API**.
4. Navigate to **APIs & Services** $\rightarrow$ **Credentials** $\rightarrow$ **Create Credentials** $\rightarrow$ **Service Account**.
5. Name the Service Account `catalog-reader` and click **Create and Continue**.
6. Select the newly created Service Account, open the **Keys** tab, click **Add Key** $\rightarrow$ **Create New Key**, and select **JSON**.
7. Download the JSON key file.
8. Open your catalog spreadsheet in Google Sheets and click **Share**.
9. Add the `client_email` from your downloaded JSON key as a viewer (`Viewer` access).

---

## 2. Environment Variables Checklist

Set the following environment variables in your Vercel Pro project settings:

| Variable Name | Required | Description | Example |
|---|---|---|---|
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Yes | The ID from your Google Sheets URL | `1A2b3C4d5E6f7G8h9I0j` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | Service account email address | `catalog-reader@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Yes | Private key string from JSON file | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"` |
| `WHATSAPP_PHONE_NUMBER` | Yes | Merchant WhatsApp number (digits only with country code) | `212600000000` |
| `NEXT_PUBLIC_STORE_NAME` | Yes | Public store name | `Jewels by A&A` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Yes | Default language (`fr`, `ar`, or `en`) | `fr` |
| `WHATSAPP_MESSAGE_MODE` | Optional | `full` (includes full address) or `minimal` (reference lookup) | `full` |

---

## 3. Vercel Pro Deployment Steps

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete storefront implementation and E2E test suite"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **Add New** $\rightarrow$ **Project**.
3. Select your `JEWELS_BY_A&A` repository.
4. Set Framework Preset to **Next.js**.
5. Under **Environment Variables**, paste all required environment variables from the table above.
6. Click **Deploy**.

---

## 4. Post-Deployment Production Verification

After deployment succeeds, verify production health:

1. **Catalog Health Check**:
   Visit `https://your-domain.vercel.app/api/catalog-health` in your browser.
   Confirm the output shows:
   ```json
   {
     "status": "ok",
     "source": "google_sheets_live",
     "activeProductCount": 3,
     "activeCategoryCount": 3
   }
   ```

2. **WhatsApp Order Flow Test**:
   - Add a product to your cart on your live domain.
   - Fill out the checkout form and submit.
   - Confirm that WhatsApp opens with the prefilled order summary addressed to your merchant phone number.
