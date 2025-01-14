document.addEventListener("DOMContentLoaded", () => {
  // Dark Mode Toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  // Enable dark mode by default
  body.classList.add("dark-mode");

  darkModeToggle.addEventListener("change", () => {
      body.classList.toggle("light-mode", darkModeToggle.checked);
      body.classList.toggle("dark-mode", !darkModeToggle.checked);
  });

  // Sign-in Form Submission
  document.getElementById("signinForm").addEventListener("submit", async (event) => {
      event.preventDefault();

      const phone = document.getElementById("phone").value;
      const subscription = document.getElementById("subscription").value;
      const statusLabel = document.getElementById("status");

      try {
          // Check subscription status
          const subscriptionStatus = await checkSubscriptionStatus(phone);

          if (subscriptionStatus === "Active") {
              statusLabel.textContent = "Status: Active";
              connectToNetwork();
          } else {
              statusLabel.textContent = "Status: Expired";
              const paymentSuccess = await triggerMpesaPayment(phone, subscription);

              if (paymentSuccess) {
                  const newStatus = await checkSubscriptionStatus(phone);
                  if (newStatus === "Active") {
                      statusLabel.textContent = "Status: Active";
                      connectToNetwork();
                  } else {
                      statusLabel.textContent = "Status: Expired";
                      alert("Payment was made but subscription is still inactive. Please contact support.");
                  }
              } else {
                  alert("Payment failed. Please try again.");
              }
          }
      } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
      }
  });
});

// Helper Functions
async function checkSubscriptionStatus(phone) {
  const response = await fetch(`/check-subscription?phone=${phone}`);
  const data = await response.json();
  return data.status;
}

async function triggerMpesaPayment(phone, subscription) {
  const subscriptionValue = getSubscriptionValue(subscription);
  const response = await fetch("/trigger-mpesa-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount: subscriptionValue }),
  });
  const data = await response.json();
  return data.success;
}

function getSubscriptionValue(subscription) {
  const prices = {
      daily: 50,
      weekly: 300,
      biweekly: 550,
      monthly: 1500,
      annual: 12000,
  };
  return prices[subscription] || 0;
}

function connectToNetwork() {
  alert("Connected to the network!");
}

async function sendBulkSMS({ apikey, partnerID, message, shortcode, mobile }) {
  try {
      const response = await fetch("https://api.advantasms.com/api/sms/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apikey, partnerID, message, shortcode, mobile }),
      });
      const data = await response.json();
      console.log("SMS sent:", data);
  } catch (error) {
      console.error("Error sending SMS:", error);
  }
}
