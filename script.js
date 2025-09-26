// Replace with your Supabase project details
const SUPABASE_URL = "https://gzrlhndodjdoegumkauu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cmxobmRvZGpkb2VndW1rYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MzMyNDUsImV4cCI6MjA3MzQwOTI0NX0.7Xs6U_tvshU-Nm3n5g_NBABPl7_r5kymT3_zWv-lMrk";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const otpForm = document.getElementById("otp-form");
  const status = document.getElementById("status");

  let phoneNumber = "";

  // Step 1: Request OTP
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    phoneNumber = document.getElementById("phone-number").value.trim();

    if (!phoneNumber) {
      status.textContent = "Please enter your phone number.";
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      status.textContent = `Error: ${error.message}`;
      return;
    }

    status.textContent = `OTP sent to ${phoneNumber}`;
    loginForm.classList.add("hidden");
    otpForm.classList.remove("hidden");
  });

  // Step 2: Verify OTP
  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = document.getElementById("otp-code").value.trim();

    if (!otp) {
      status.textContent = "Enter the OTP.";
      return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: "sms",
    });

    if (error) {
      status.textContent = `Invalid OTP ❌ (${error.message})`;
    } else {
      status.textContent = `Login successful ✅ Welcome ${phoneNumber}`;
      otpForm.classList.add("hidden");
    }
  });
});
