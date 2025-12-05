
// Simple page navigation (buttons that exist on multiple pages)
const navMap = [
    ['home', 'index.html'],
    ['contact', 'contact.html'],
    ['about', 'about.html']
];

navMap.forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { window.location.href = href; });
});

// Contact form handling with validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const errorsEl = document.getElementById('errors') || document.getElementById('contact-result');
    const successEl = document.getElementById('success');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Use built-in HTML5 validation
        if (!contactForm.checkValidity()) {
            // Let browser show native validation UI, and also show an error message if present
            contactForm.reportValidity();
            if (errorsEl) errorsEl.textContent = 'Please fill in your name, email, and short bio.';
            return;
        }

        // prepare payload
        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        // show a waiting state
        if (errorsEl) errorsEl.textContent = '';
        if (successEl) successEl.style.display = 'none';

        // send to endpoint
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async (response) => {
            const json = await response.json().catch(() => ({}));
            if (response.status === 200) {
                if (successEl) successEl.style.display = 'block';
                if (errorsEl) errorsEl.textContent = '';
            } else {
                console.error('Form submit error', response, json);
                if (errorsEl) errorsEl.textContent = json.message || 'Submission failed.';
            }
        })
        .catch((err) => {
            console.error(err);
            if (errorsEl) errorsEl.textContent = 'Something went wrong. Please try again later.';
        })
        .finally(() => {
            // reset form after a short delay so the user sees the success message
            setTimeout(() => {
                contactForm.reset();
                if (successEl) successEl.style.display = 'none';
            }, 5000);
        });
    });
}

