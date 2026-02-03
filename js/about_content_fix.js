// Script to enforce content persistence on the About page
// Prevents Next.js hydration from reverting manual content changes

(function() {
    const CONTAINER_ID = 'about-main-content';
    const CONTAINER_SELECTOR = '.mx-auto.max-w-screen-lg.px-6.py-12';

    // The desired HTML structure provided by the user
    // FLATTENED STRINGS to ensure matches with js/translations.js
    const DESIRED_HTML = `
          <section class="px-6 py-8 md:px-8">
            <div class="mx-auto max-w-4xl space-y-4">
              <p class="leading-relaxed"><strong>Aeronix</strong> is a technology company focused on enhancing safety, security, and operational efficiency through advanced AI, computer vision, biometrics, IoT, and video analytics.</p>
              <p class="leading-relaxed">Founded in 2013 by two PhD-level experts in biometrics and artificial intelligence, <strong>Aeronix</strong> builds intelligent solutions that power critical operations across aviation, education, corrections, healthcare, government, mining, retail, and more.</p>
            </div>
          </section>
          <section class="px-6 py-8 md:px-8">
            <div class="mx-auto max-w-4xl space-y-4">
              <h2 class="text-3xl font-bold tracking-tight">Our Vision</h2>
              <p class="leading-relaxed">At <strong>Aeronix</strong>, our vision is to be a reliable, innovative, and benchmark technology solution partner that redefines the safety, security, and efficiency standards of organizations conducting critical operations in Turkey with intelligent solutions based on artificial intelligence, computer vision, biometrics, IoT, and video analytics.</p>
              <p class="leading-relaxed">We aim to be a pioneering brand that accelerates digital transformation in different sectors, promotes a data-driven decision-making culture, and brings global technologies together with local needs.</p>
            </div>
          </section>
          <section class="px-6 py-8 md:px-8">
            <div class="mx-auto max-w-4xl space-y-4">
              <h2 class="text-3xl font-bold tracking-tight">Our Mission</h2>
              <p class="leading-relaxed">At <strong>Aeronix</strong>, our mission is to effectively introduce the advanced technology products and services of Australian-based Aervision to the Turkish market, adding real-time, secure, and sustainable value to the operational processes of organizations operating in a wide range of sectors, from aviation to public sector, healthcare to education, mining to retail.</p>
              <p class="leading-relaxed">With our intelligent system integrations, local expertise, and strong service infrastructure, we offer solutions that reduce risks, increase operational efficiency, and enable organizations to move towards the future with greater confidence.</p>
            </div>
          </section>
          <section class="px-6 py-8 md:px-8">
            <div class="mx-auto max-w-4xl space-y-4">
              <h2 class="text-3xl font-bold tracking-tight">Our Team</h2>
              <p class="leading-relaxed">At <strong>Aeronix</strong>, our team combines deep expertise in computer vision, machine learning, and high-performance system development to build real-world AI solutions.</p>
              <p class="leading-relaxed">From startups to enterprise clients, we collaborate closely to deliver tailored biometrics, security, and surveillance technologies that meet the unique demands of each deployment.</p>
            </div>
          </section>
          <section class="px-6 py-8 md:px-8">
            <div class="mx-auto max-w-4xl space-y-4">
              <h2 class="text-3xl font-bold tracking-tight">Our Products</h2>
              <p class="leading-relaxed">Our products help organizations address two critical areas in safety and security: real-time situational awareness and secure access control.</p>
              <p class="leading-relaxed">The <strong>Aeronix</strong> AI platform delivers enhanced visualization and actionable intelligence, empowering security teams to elevate security, ensure compliance, and reduce risk.</p>
            </div>
          </section>
          <section class="px-6 py-8 md:px-8">
            <div class="mx-auto max-w-4xl space-y-4">
              <h2 class="text-3xl font-bold tracking-tight">Our Reputation</h2>
              <p class="leading-relaxed">We take pride in delivering technology that is both powerful and easy to use. Our team is committed to solving complex problems with precision, efficiency, and care.</p>
              <p class="leading-relaxed">From on-time delivery to exceptional after-sales support, our clients trust us to meet the highest standards of quality — all within budget.</p>
            </div>
          </section>`;

    // Keywords that indicate the presence of the NEW content (either English or Turkish)
    const VALIDATION_KEYWORDS = [
        "redefines the safety, security, and efficiency standards", // English Vision part
        "emniyet, güvenlik ve verimlilik standartlarını yeniden tanımlayan", // Turkish Vision part
        "Australian-based Aervision", // English Mission part
        "Avustralya menşeili Aervision", // Turkish Mission part
        "Our Vision",
        "Vizyonumuz" // Assumed Turkish header for Our Vision
    ];

    function checkAndFixContent() {
        let container = document.getElementById(CONTAINER_ID);

        // If ID not found (React might have stripped it), try finding by class
        if (!container) {
             // Look for the container that usually holds this content.
             // We can check strictly by classes or loosely.
             const candidates = document.querySelectorAll(CONTAINER_SELECTOR);
             for (let i = 0; i < candidates.length; i++) {
                 // To be safe, maybe check if it's inside 'main' or has 'The Company' header?
                 // But for now, let's assume the first one matching these specific classes is ours.
                 // Actually, let's pick the one that is NOT hidden.
                 if (candidates[i].offsetParent !== null) {
                     container = candidates[i];
                     // Re-apply ID so next time it's faster
                     container.id = CONTAINER_ID;
                     break;
                 }
             }
        }

        if (!container) return;

        const textContent = container.innerText;

        // Check if ANY of the validation keywords are present.
        // If at least one is present, we assume the content is correct (either English or Turkish).
        let isValid = false;
        for (let i = 0; i < VALIDATION_KEYWORDS.length; i++) {
            if (textContent.includes(VALIDATION_KEYWORDS[i])) {
                isValid = true;
                break;
            }
        }

        // If content is not valid (likely reverted to old version), enforce the desired HTML
        if (!isValid) {
            console.log("Aeronix: Re-applying About page content...");
            container.innerHTML = DESIRED_HTML;
            // Ensure ID persists
            if (container.id !== CONTAINER_ID) container.id = CONTAINER_ID;
        }
    }

    // Run aggressively
    setInterval(checkAndFixContent, 250);

    // Also run immediately
    checkAndFixContent();

})();
