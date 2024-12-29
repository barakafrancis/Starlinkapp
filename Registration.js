document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  darkModeToggle.addEventListener("change", () => {
      document.body.classList.toggle("light-mode", darkModeToggle.checked);
  });
});

document.getElementById('signinForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const subscription = document.getElementById('subscription').value;
    const statusLabel = document.getElementById('status');
  
    try {
      // 1. Check subscription status from server
      const subscriptionStatus = await checkSubscriptionStatus(phone);
  
      if (subscriptionStatus === 'Active') {
        statusLabel.textContent = 'Status: Active';
        // Execute the connection logic here (e.g., grant WiFi access)
        connectToNetwork();
      } else {
        statusLabel.textContent = 'Status: Expired';
        
        // 2. Trigger M-Pesa C2B prompt for payment
        const paymentSuccess = await triggerMpesaPayment(phone, subscription);
  
        if (paymentSuccess) {
          // 3. Recheck subscription status after payment
          const newStatus = await checkSubscriptionStatus(phone);
          if (newStatus === 'Active') {
            statusLabel.textContent = 'Status: Active';
            // Execute the connection logic here (e.g., grant WiFi access)
            connectToNetwork();
          } else {
            statusLabel.textContent = 'Status: Expired';
            alert('Payment was made but subscription is still inactive. Please contact support.');
          }
        } else {
          alert('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the request.');
    }
  });
  
  // Function to check the subscription status from the server
  async function checkSubscriptionStatus(phone) {
    // Make an API call to your server to check the subscription status
    const response = await fetch(`/check-subscription?phone=${phone}`);
    const data = await response.json();
    return data.status; // Return 'Active' or 'Expired'
  }
  
  // Mock function to trigger M-Pesa C2B payment
  async function triggerMpesaPayment(phone, subscription) {
    const subscriptionValue = getSubscriptionValue(subscription); // Get value based on selected plan
    const response = await fetch('/trigger-mpesa-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        amount: subscriptionValue,
      }),
    });
    
    const data = await response.json();
    return data.success; // Assume server returns success or failure
  }
  
  // Helper function to map subscription to its price
  function getSubscriptionValue(subscription) {
    switch (subscription) {
      case 'daily': return 50; // Example price for daily
      case 'weekly': return 300; // Example price for weekly
      case 'biweekly': return 550; // Example price for Bi-weekly
      case 'monthly': return 1500; // Example price for monthly
      case 'annual': return 12000; // Example price for annual
      default: return 0;
    }
  }
  
  // Function to simulate connecting to the network
  function connectToNetwork() {
    alert('Connected to the network!');
  }
  
// Function to toggle status between Active and Expired
function updateStatus(isActive) {
    const statusText = document.getElementById('statusText');
    const statusContainer = document.getElementById('status');

    if (isActive,1) {
        statusText.textContent = 'Active';
        statusContainer.classList.remove('status-expired');
        statusContainer.classList.add('status-active');
    } else {
        statusText.textContent = 'Expired';
        statusContainer.classList.remove('status-active');
        statusContainer.classList.add('status-expired');
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;

  // Enable dark mode by default
  body.classList.add('dark-mode');

  // Toggle between light and dark mode
  darkModeToggle.addEventListener('change', function () {
      if (this.checked) {
          body.classList.remove('dark-mode');
          body.classList.add('light-mode');
      } else {
          body.classList.remove('light-mode');
          body.classList.add('dark-mode');
      }
  });
});
