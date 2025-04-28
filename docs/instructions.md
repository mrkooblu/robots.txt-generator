# Robots.txt Generator Application - Development Instructions

## Overview
You are tasked with building a **Robots.txt Generator** web application. The application will allow users to generate a `robots.txt` file either from scratch or by selecting pre-defined suggestions for general use or specific CMS platforms. The application must be user-friendly, responsive, and feature a clean UI inspired by the provided screenshots.

This document provides detailed instructions on the required features, UI components, and logic for generating the `robots.txt` file.

---

## General Requirements

1. **Technology Stack**:
   - Use **HTML**, **CSS**, and **JavaScript** for the frontend.
   - Optionally, use a framework like **React**, **Vue.js**, or **Svelte** for better component management.
   - Use **Bootstrap**, **Tailwind CSS**, or a similar CSS framework to style the application and ensure responsiveness.
   - No backend is required; all logic can be handled client-side.

2. **UI/UX Guidelines**:
   - Follow the design and layout shown in the screenshots.
   - Use a light color scheme with a clean, minimalistic design.
   - Ensure the application is fully responsive across devices (desktop, tablet, mobile).

3. **Core Functionality**:
   - Allow users to create a `robots.txt` file from scratch by specifying rules (Allow/Disallow, paths, bots).
   - Provide pre-defined suggestions under two categories: "General Suggestions" and "Ready-made robots.txt file for CMS".
   - Include a field for users to input their sitemap URL.
   - Generate the `robots.txt` file content and allow users to copy or download it.
   - Include a "Reset" button to clear all inputs.

---

## UI Structure

### Main Section
- **Title**: "Robots.txt Generator" in large, bold text.
- **Tabs**: Two tabs below the title:
  - "Create a robots.txt file from scratch" (default selected, with a blue underline).
  - "Choose one of the suggested options".

#### Tab 1: Create a robots.txt file from scratch
- **Sub-Title**: "Create a robots.txt file from scratch".
- **Table**:
  - A table with three columns: "Action", "Path", and "Bot".
  - **Action Column**:
    - Dropdown with two options: "Allow" (green dot) and "Disallow" (red dot).
  - **Path Column**:
    - Text input field with placeholder text (e.g., "e.g.: /wp-admin").
  - **Bot Column**:
    - Dropdown with the following options:
      - **All** (default selected)
      - Bingbot
      - Googlebot
      - Googlebot-Image
      - Googlebot-Mobile
      - Googlebot-News
      - Googlebot-Video
      - Mediapartners-Google
      - AdsBot-Google
      - YandexBot
      - AhrefsBot
      - SemrushBot
  - **Add Row Button**: A "+ Add another row" button below the table to dynamically add more rows.
  - **Copy Buttons**: Below the table, include two buttons:
    - "Copy all essential files" (with a document icon).
    - "Copy all images" (with an image icon).

- **Sitemap Input**:
  - A field labeled "Your sitemap file" with a placeholder (e.g., "https://your-site.com/sitemap.xml").

- **Action Buttons**:
  - "Generate robots.txt" (primary button with a purple background).
  - "Reset" (secondary button with a circular arrow icon).

#### Tab 2: Choose one of the suggested options
- **Sub-Title**: "Suggestions".
- **Two Columns**:
  - **Column 1: General Suggestions**
    - A list of toggleable options (each with an info icon):
      - Allow everything
      - Disallow a website to crawl
      - Allow everything for Google only
      - Disallow everything for most commonly blocked bots
      - Disallow for all Google bots, except Google
      - Allow for all Google bots
    - Each option should have an info icon (`i`) that, when clicked, displays a brief description (see **Information Boxes** section below).

  - **Column 2: Ready-made robots.txt file for CMS**
    - A list of toggleable options (each with an info icon):
      - robots.txt for WordPress
      - robots.txt for Joomla
      - robots.txt for MODX
      - robots.txt for Drupal
      - robots.txt for Magento
      - robots.txt for OpenCart
      - robots.txt for WooCommerce
    - Each option should have an info icon (`i`) that, when clicked, displays a brief description (see **Information Boxes** section below).

- **Sitemap Input**:
  - Same as in Tab 1: A field labeled "Your sitemap file" with a placeholder (e.g., "https://your-site.com/sitemap.xml").

- **Action Buttons**:
  - "Generate robots.txt" (primary button with a purple background).
  - "Reset" (secondary button with a circular arrow icon).

---

## Functionality Details

### Tab 1: Create a robots.txt file from scratch
- **Dynamic Table**:
  - Users can add multiple rows to specify rules for different bots and paths.
  - Each row generates a line in the `robots.txt` file based on the selected action, path, and bot.
  - Example: If a user selects "Disallow", "/wp-admin", and "All", the generated line should be:
    ```
    User-agent: *
    Disallow: /wp-admin
    ```
  - If the bot is specific (e.g., "Googlebot"), the line should be:
    ```
    User-agent: Googlebot
    Disallow: /wp-admin
    ```

- **Sitemap**:
  - If the user provides a sitemap URL, append the following line to the generated `robots.txt` file:
    ```
    Sitemap: https://your-site.com/sitemap.xml
    ```

- **Copy Buttons**:
  - "Copy all essential files": Generates a `robots.txt` snippet that disallows common essential file paths (e.g., `/wp-admin/`, `/wp-includes/`) and copies it to the clipboard.
  - "Copy all images": Generates a `robots.txt` snippet that disallows image crawling (e.g., `Disallow: *.jpg`, `Disallow: *.png`) and copies it to the clipboard.

- **Generate Button**:
  - Combines all rules from the table and the sitemap (if provided) into a single `robots.txt` file.
  - Displays the generated content in a modal or textarea with options to copy or download the file.

- **Reset Button**:
  - Clears all table rows (except the first default row), resets dropdowns to default values, and clears the sitemap input.

### Tab 2: Choose one of the suggested options
- **General Suggestions**:
  - Each option, when toggled, should generate a predefined `robots.txt` file content.
  - Only one option can be selected at a time (radio button behavior).
  - Example mappings:
    - **Allow everything**:
      ```
      User-agent: *
      Allow: /
      ```
    - **Disallow a website to crawl**:
      ```
      User-agent: *
      Disallow: /
      ```
    - **Allow everything for Google only**:
      ```
      User-agent: Googlebot
      Allow: /
      User-agent: *
      Disallow: /
      ```
    - **Disallow everything for most commonly blocked bots**:
      ```
      User-agent: MJ12bot
      Disallow: /
      User-agent: AhrefsBot
      Disallow: /
      User-agent: SemrushBot
      Disallow: /
      ```
    - **Disallow for all Google bots, except Google**:
      ```
      User-agent: Googlebot-Image
      Disallow: /
      User-agent: Googlebot-Mobile
      Disallow: /
      User-agent: Googlebot-News
      Disallow: /
      User-agent: Googlebot-Video
      Disallow: /
      ```
    - **Allow for all Google bots**:
      ```
      User-agent: Googlebot
      Allow: /
      User-agent: Googlebot-Image
      Allow: /
      User-agent: Googlebot-Mobile
      Allow: /
      User-agent: Googlebot-News
      Allow: /
      User-agent: Googlebot-Video
      Allow: /
      ```

- **Ready-made robots.txt file for CMS**:
  - Each option, when toggled, should generate a predefined `robots.txt` file content tailored for the specific CMS.
  - Only one option can be selected at a time (radio button behavior).
  - Example mappings:
    - **robots.txt for WordPress**:
      ```
      User-agent: *
      Disallow: /wp-admin/
      Allow: /wp-admin/admin-ajax.php
      Disallow: /wp-includes/
      ```
    - **robots.txt for Joomla**:
      ```
      User-agent: *
      Disallow: /administrator/
      Disallow: /cache/
      Disallow: /tmp/
      ```
    - **robots.txt for MODX**:
      ```
      User-agent: *
      Disallow: /manager/
      Disallow: /assets/
      ```
    - **robots.txt for Drupal**:
      ```
      User-agent: *
      Disallow: /admin/
      Disallow: /sites/default/files/
      ```
    - ** Roberts.txt for Magento**:
      ```
      User-agent: *
      Disallow: /admin/
      Disallow: /downloader/
      Disallow: /var/
      ```
    - **robots.txt for OpenCart**:
      ```
      User-agent: *
      Disallow: /admin/
      Disallow: /system/
      ```
    - **robots.txt for WooCommerce**:
      ```
      User-agent: *
      Disallow: /wp-admin/
      Disallow: /cart/
      Disallow: /checkout/
      ```

- **Sitemap**:
  - Same as Tab 1: If a sitemap URL is provided, append it to the generated `robots.txt` file.

- **Generate Button**:
  - Generates the `robots.txt` file based on the selected suggestion and sitemap (if provided).
  - Displays the generated content in a modal or textarea with options to copy or download the file.

- **Reset Button**:
  - Deselects all toggles and clears the sitemap input.

---

## Information Boxes

For each item under the "Suggestions" tab, include an info icon (`i`) that, when clicked, displays a brief description in a tooltip or modal. Below are the descriptions for each item.

### General Suggestions
- **Allow everything**:
  ```
  This option allows all bots to crawl your entire website without restrictions.
  ```
- **Disallow a website to crawl**:
  ```
  This option prevents all bots from crawling any part of your website.
  ```
- **Allow everything for Google only**:
  ```
  This option allows only Google bots to crawl your website while blocking all other bots.
  ```
- **Disallow everything for most commonly blocked bots**:
  ```
  This option blocks commonly unwanted bots like MJ12bot, AhrefsBot, and SemrushBot from crawling your website.
  ```
- **Disallow for all Google bots, except Google**:
  ```
  This option blocks all Google-specific bots (e.g., Googlebot-Image, Googlebot-News) except the main Googlebot.
  ```
- **Allow for all Google bots**:
  ```
  This option allows all Google bots (including Googlebot, Googlebot-Image, etc.) to crawl your website.
  ```

### Ready-made robots.txt file for CMS
- **robots.txt for WordPress**:
  ```
  This robots.txt is optimized for WordPress, blocking access to sensitive areas like /wp-admin/ while allowing admin-ajax.php for functionality.
  ```
- **robots.txt for Joomla**:
  ```
  This robots.txt is tailored for Joomla, restricting access to the administrator and temporary folders.
  ```
- **robots.txt for MODX**:
  ```
  This robots.txt is designed for MODX, blocking access to the manager and assets directories.
  ```
- **robots.txt for Drupal**:
  ```
  This robots.txt is optimized for Drupal, preventing bots from accessing admin and file directories.
  ```
- **robots.txt for Magento**:
  ```
  This robots.txt is crafted for Magento, blocking access to admin, downloader, and var directories.
  ```
- **robots.txt for OpenCart**:
  ```
  This robots.txt is suited for OpenCart, restricting access to admin and system directories.
  ```
- **robots.txt for WooCommerce**:
  ```
  This robots.txt is optimized for WooCommerce, blocking access to admin, cart, and checkout pages.
  ```

---

## Additional Features

1. **Validation**:
   - Ensure the sitemap URL is a valid URL (starts with `http://` or `https://`).
   - Prevent empty paths in the "Create from scratch" table rows.

2. **Output Modal**:
   - When the "Generate robots.txt" button is clicked, display a modal with the generated `robots.txt` content.
   - Include buttons to:
     - Copy the content to the clipboard.
     - Download the content as a `robots.txt` file.

3. **Accessibility**:
   - Ensure all interactive elements (buttons, dropdowns, toggles) are accessible via keyboard.
   - Add appropriate ARIA labels for screen readers.

4. **Error Handling**:
   - Display a warning if no rules are selected in "Create from scratch" or no suggestion is toggled in the "Suggestions" tab before generating.

---

## Deliverables
- A fully functional Robots.txt Generator web application.
- Source code with comments explaining the logic for generating `robots.txt` files.
- A README file with instructions on how to run the application locally.

---

## Notes
- If you encounter any ambiguities in the requirements, make reasonable assumptions and document them in the code comments.
- Test the application thoroughly to ensure all features work as expected, especially the dynamic table in "Create from scratch" and the toggle behavior in "Suggestions".D