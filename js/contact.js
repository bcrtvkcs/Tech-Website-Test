document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Map the obscure Google Form entry names to readable ones if possible,
            // or just dump them into the body.
            // Based on input placeholders:
            // entry.1799059588 -> Name
            // entry.1475330731 -> Email
            // entry.512198433 -> Mobile
            // entry.378930849 -> Company
            // entry.690197594 -> Position
            // entry.612707324 -> Enquiry
            // entry.1956456557 -> How did you hear

            const name = document.querySelector('input[placeholder="Your name"]')?.value || '';
            const email = document.querySelector('input[placeholder="Your email"]')?.value || '';
            const mobile = document.querySelector('input[placeholder="Your mobile number"]')?.value || '';
            const company = document.querySelector('input[placeholder="Your company"]')?.value || '';
            const position = document.querySelector('input[placeholder="Your position"]')?.value || '';
            const enquiry = document.querySelector('textarea[placeholder="Your enquiry"]')?.value || '';
            const source = document.querySelector('select')?.value || '';

            const subject = `New Contact from ${name} - ${company}`;
            const body = `Name: ${name}
Email: ${email}
Mobile: ${mobile}
Company: ${company}
Position: ${position}
Source: ${source}

Enquiry:
${enquiry}`;

            const mailtoLink = `mailto:sales@aeronix.com.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;
        });
    }
});
