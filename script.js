// Data lives in memory for now (it resets on refresh; we'll fix that later)
const subscriptions = [];

// Grab the elements we need from the page, once, at the top
const form = document.getElementById("subscription-form");
const list = document.getElementById("subscription-list");
const totalDisplay = document.getElementById("total-monthly");
const activeCount = document.getElementById("active-count");
const isTrial = document.getElementById("is-trial");
const trialField = document.getElementById("trial-field");

// Show the trial date field only when the checkbox is checked
isTrial.addEventListener("change", function () {
  trialField.hidden = !isTrial.checked;
});

// Convert any billing frequency into a monthly equivalent
function toMonthly(amount, frequency) {
  if (frequency === "yearly") return amount / 12;
  if (frequency === "quarterly") return amount / 3;
  return amount;
}

// When the form is submitted, build an object and store it
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the browser from reloading the page

  const amount = parseFloat(document.getElementById("amount").value);
  const frequency = document.getElementById("frequency").value;

  const subscription = {
    id: Date.now(),
    name: document.getElementById("name").value,
    amount: amount,
    frequency: frequency,
    monthlyEquivalent: toMonthly(amount, frequency),
    renewalDate: document.getElementById("renewal-date").value,
    isTrial: isTrial.checked,
    trialEndDate: isTrial.checked
      ? document.getElementById("trial-end").value
      : null,
    status: "active",
  };

  subscriptions.push(subscription);
  form.reset();
  trialField.hidden = true;
  render();
});

// Redraw the list and the summary from the data
function render() {
  list.innerHTML = "";
  let total = 0;
  let active = 0;

  subscriptions.forEach(function (sub) {
    const item = document.createElement("li");
    item.textContent = `${sub.name} — $${sub.amount.toFixed(2)} (${sub.frequency}), renews ${sub.renewalDate}`;
    list.appendChild(item);

    if (sub.status === "active") {
      total += sub.monthlyEquivalent;
      active += 1;
    }
  });

  totalDisplay.textContent = "$" + total.toFixed(2);
  activeCount.textContent = active;
}
