# 🌴 SEAVIEW Resort & Kubo Villas — Booking & Management System

> **Modern Filipino Coastal Sanctuary** — A full-stack, high-performance resort booking engine and dynamic CMS platform built with Next.js, TypeScript, Tailwind CSS, Supabase, and Nodemailer/Resend.

---

## ✨ Project Overview

**SEAVIEW** is an executive coastal resort web application where ancestral Philippine architecture meets contemporary beachfront luxury. The platform combines a seamless guest booking and inquiry experience with a powerful, single-page **Admin Management Desk** that allows resort managers to dynamically edit website text, upload hero slideshows, manage room listings, process reservations, and track guest inquiries in real-time.

---

## 🚀 Key Features

### 🏖️ Guest Experience
* **Dynamic Home Page (`/`)**:
  * High-visibility, full-width Hero slideshow with Ken Burns zoom effects and smooth crossfade transitions.
  * Real-time Date Availability Filter Bar for instant room searching.
  * Bedbox-inspired full-bleed story banner cards with seamless dark gradients.
* **Handcrafted Kubo Villas Page (`/villas`)**:
  * Dynamic Accommodations header (editable page title & description).
  * Filterable room showcase displaying bed types, guest capacity, villa size ($m^2$), pricing, and image carousels.
* **The Sanctuary Page (`/sanctuary`)**:
  * Unified continuous dark canvas design `#1c120c` (eliminating white gaps and harsh section dividers).
  * Dynamic hero slideshow connected directly to the Sanctuary gallery photo pool.
  * Independent Sanctuary story cards and interactive amenities grid (Waves, Yoga, Eco-Crafted, Pool, etc.).
  * Responsive luxury photo gallery grid with expandable "Load More" controls.
* **Contact Us & Concierge Page (`/contact`)**:
  * Floating dark glass overlay card over a resort banner.
  * Hotlines, landline, address, and concierge email service bar.
  * Interactive Guest Inquiry Form — automatically stores inquiries in Supabase and routes email notifications via **Nodemailer (Gmail SMTP)** or **Resend**.

---

### 🛡️ Admin Management Desk (`/admin`)

A single, clean tabbed portal providing full control over the website without writing code:

1. **Reservations & Payments Tab**:
   * Live financial overview (Total Revenue, Pending, Confirmed, Total Stays).
   * Booking status update controls (`Confirm`, `Cancel`, `Pending`).
2. **Kubo Villas Management Tab**:
   * Directly edit the Villas page main title and description paragraph.
   * Manage individual villa details, pricing, guest capacities, and room photos.
3. **Site Content & Branding Tab**:
   * **Business Branding**: Logo upload, resort name, reserve button text.
   * **Navigation Builder**: Dynamically add, reorder, or update header menu links.
   * **Hero & Story Editor**: Upload hero slideshow photos, change headlines, and edit story cards for the Home page.
   * **Sanctuary Page CMS**: Manage Sanctuary hero text, story cards, banner photos, amenities grid, and upload unlimited gallery photos.
   * **Contact Page CMS**: Upload contact hero photo, update landline numbers, edit overlay cards, and configure the inquiry recipient email address (`aranjitarchita@gmail.com`).
   * **Footer & Branding**: Customize resort address, phone, email, and watermark.
4. **Users & Staff Access Tab**:
   * Register new Front Desk Staff, Managers, or Administrators.
   * Role-based user listing and account creation.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, Server Components)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth, Storage Buckets)
* **Email Delivery**: [Nodemailer](https://nodemailer.com/) (Gmail SMTP) / [Resend](https://resend.com/)

---

## 🚀 Getting Started
Clone the repository:

Bash
git clone [https://github.com/tijnara/HotelResort-Booking-Website.git](https://github.com/tijnara/HotelResort-Booking-Website.git)
cd HotelResort-Booking-Website
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open application:

Main Website: http://localhost:3000

Admin Portal: http://localhost:3000/admin

---

## 📁 Project Structure
```text
src/
├── app/                  # Application routes & pages
│   ├── admin/            # Admin management portal & authentication
│   ├── contact/          # Contact Us & Guest Inquiry page
│   ├── sanctuary/        # The Sanctuary wellness page
│   ├── villas/           # Kubo Villas room listings
│   └── page.tsx          # Home landing page
├── modules/              # Feature-based modular logic
│   ├── admin/            # Admin components, server actions & modals
│   ├── contact/          # Contact UI & inquiry server action
│   ├── home/             # Hero slideshow & story section components
│   ├── rooms/            # Villa carousel, availability bar & room filters
│   ├── sanctuary/        # Sanctuary gallery, amenities & story components
│   └── settings/         # Site settings service & fetchers
└── shared/               # Shared utilities & global types
    ├── lib/              # Supabase client & server instances
    └── types/            # Database TypeScript types
```
---

## 👤 Developer & Maintainer
by @tijnara.

### © 2026 SEAVIEW Resort. All rights reserved.
