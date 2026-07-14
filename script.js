/* ==========================================================
   ArmaFix — script.js
   Language toggle (ES/EN), WhatsApp links, form submit, FAQ
   ========================================================== */

(function () {
  "use strict";

  /* ---------- CONFIG ---------- */
  var WHATSAPP_NUMBER = "34614191396";
  // Apps Script Web App URL — replace after deploying the Google Apps Script (Sheets + Telegram)
  var FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwqXarY1k3AaHqUcqzjjDa6nzULZ7sRN_sypJ7-zDGBC1vbxdsImixel6eqbadn2Zbs/exec";

  /* ---------- TRANSLATIONS ---------- */
  var translations = {
    es: {
      "nav.whatsapp": "WhatsApp",
      "hero.eyebrow": "Málaga · Marbella · Costa del Sol",
      "hero.h1": "Montaje de muebles en Málaga, Marbella y Costa del Sol",
      "hero.sub": "Montador profesional. IKEA, Leroy Merlin y cualquier otra marca. Garantía incluida. Presupuesto rápido por WhatsApp.",
      "hero.cta_wa": "Escribir por WhatsApp",
      "hero.cta_form": "Pedir presupuesto",
      "services.eyebrow": "Servicios",
      "services.h2": "Qué monto",
      "services.p1": "Realizo el <strong>montaje de cocinas completas</strong>, <strong>armarios y vestidores</strong> (incluidos los sistemas PAX de IKEA), <strong>escritorios regulables en altura</strong>, <strong>camas y literas infantiles</strong>. Para el salón, monto <strong>sofás, sillas, cómodas, tocadores y estanterías</strong>, además de <strong>soportes de TV</strong> y <strong>muebles de jardín y terraza</strong>.",
      "services.p2": "También ofrezco montaje de <strong>máquinas de fitness y equipamiento deportivo</strong> — cintas de correr, bicicletas estáticas y estaciones de musculación — así como <strong>mobiliario de oficina</strong>: mesas, sillas, archivadores y mamparas.",
      "services.p3": "Para empresas y negocios, monto <strong>mobiliario comercial</strong>: estanterías para tiendas, mostradores, mobiliario de bares, restaurantes, hoteles y apartamentos turísticos. Trabajo también con <strong>guarderías, colegios y academias</strong>, equipando aulas completas.",
      "services.p4": "Trabajo con muebles de <strong>IKEA, Leroy Merlin</strong> y cualquier otra marca. Desde el montaje de un solo mueble hasta el <strong>amueblamiento completo de una vivienda, oficina o negocio</strong> en Málaga, Marbella y toda la Costa del Sol — con <strong>descuento por volumen</strong> para pedidos grandes: mudanzas, reformas, apertura de negocios o amueblamiento de apartamentos nuevos para inversores y agencias inmobiliarias.",
      "gallery.eyebrow": "Trabajos realizados",
      "gallery.h2": "Antes y después",
      "gallery.cama": "Montaje de cama",
      "gallery.escritorio": "Montaje de escritorio",
      "gallery.escritorio_reg": "Escritorio regulable en altura",
      "gallery.litera": "Montaje de litera",
      "gallery.sofa": "Montaje de sofá",
      "gallery.sillas": "Montaje de sillas",
      "gallery.tocador": "Montaje de tocador",
      "gallery.estanteria": "Montaje de estantería",
      "gallery.jardin": "Muebles de jardín",
      "pricing.eyebrow": "Presupuesto",
      "pricing.h2": "Cómo calculamos el presupuesto",
      "pricing.f1_h": "Ubicación y distancia",
      "pricing.f1_p": "El precio varía según la zona: no es lo mismo un montaje en Málaga capital que un desplazamiento a Marbella, Puerto Banús o Estepona.",
      "pricing.f2_h": "Tipo y cantidad de muebles",
      "pricing.f2_p": "No cuesta lo mismo el montaje de una silla que el de una cocina completa. Para varios muebles a la vez aplicamos descuento por volumen.",
      "pricing.f3_h": "Entrega del mueble",
      "pricing.f3_p": "Si el mueble ya está en tu domicilio, el montaje es más rápido. Si necesitas recogida y entrega, este servicio se suma al presupuesto.",
      "pricing.f4_h": "Acceso a la vivienda",
      "pricing.f4_p": "Un piso sin ascensor influye en el tiempo y esfuerzo, especialmente en muebles grandes.",
      "pricing.f5_h": "Desmontaje previo",
      "pricing.f5_p": "Si necesitas retirar un mueble viejo antes de montar el nuevo, este trabajo se incluye en el presupuesto.",
      "pricing.f6_h": "Urgencia",
      "pricing.f6_p": "Un montaje programado con antelación suele ser más económico que un servicio urgente el mismo día.",
      "form.eyebrow": "Solicitar",
      "form.h2": "Solicitar presupuesto",
      "form.intro": "Cada montaje es diferente, por eso el precio se calcula de forma personalizada. Rellena el formulario y te contactamos para confirmar los detalles: tipo de mueble, ubicación exacta, si necesitas desmontaje o entrega, y el número de piezas.",
      "form.name": "Nombre",
      "form.phone": "Teléfono",
      "form.postal": "Código postal",
      "form.promo": "Código promocional",
      "form.optional": "(opcional)",
      "form.consent": 'He leído y acepto la <a href="privacidad.html">Política de privacidad</a>',
      "form.submit": "Solicitar presupuesto",
      "form.sending": "Enviando...",
      "form.success": "¡Gracias! Te contactaremos en breve.",
      "form.error": "Hubo un problema. Escríbenos por WhatsApp.",
      "zone.eyebrow": "Cobertura",
      "zone.h2": "Zona de servicio",
      "zone.p1": "<strong>Málaga capital, Marbella, Puerto Banús, San Pedro de Alcántara, Torremolinos y Benalmádena.</strong>",
      "zone.p2": "También trabajo en Estepona, Fuengirola, Mijas, Benahavís, Rincón de la Victoria, Alhaurín de la Torre y Cártama.",
      "zone.p3": "Para otras localidades de la provincia, escríbeme y consultamos disponibilidad.",
      "zone.map_link": "Ver en Google Maps →",
      "faq.eyebrow": "Dudas",
      "faq.h2": "Preguntas frecuentes",
      "faq.q1": "¿Cuánto cuesta el montaje de un mueble?",
      "faq.a1": "El precio depende del tipo, tamaño y ubicación. Rellena el formulario o escríbeme por WhatsApp con una foto para un presupuesto rápido.",
      "faq.q2": "¿Montáis muebles de cualquier marca?",
      "faq.a2": "Sí, IKEA, Leroy Merlin, Conforama y fabricantes locales.",
      "faq.q3": "¿Hacéis montaje para empresas, hostelería o negocios?",
      "faq.a3": "Sí, trabajo con oficinas, restaurantes, hoteles, apartamentos turísticos, tiendas, guarderías y colegios.",
      "faq.q4": "¿Podéis montar máquinas de fitness?",
      "faq.a4": "Sí, cintas de correr, bicicletas estáticas y estaciones de musculación.",
      "faq.q5": "¿Hay descuento para pedidos grandes?",
      "faq.a5": "Sí, aplicamos descuento por volumen en mudanzas, reformas o amueblamiento completo.",
      "faq.q6": "¿Trabajáis con agencias inmobiliarias?",
      "faq.a6": "Sí, ofrezco servicio de amueblamiento completo para pisos nuevos, ideal para inversores y agencias.",
      "faq.q7": "¿Necesito comprar herramientas?",
      "faq.a7": "No, trabajo con herramienta propia.",
      "faq.q8": "¿Dais garantía en el montaje?",
      "faq.a8": "Sí, todo trabajo incluye garantía.",
      "faq.q9": "¿Trabajáis en Marbella y Puerto Banús?",
      "faq.a9": "Sí, servicio habitual en Marbella, Puerto Banús y San Pedro de Alcántara.",
      "cta.h2": "¿Listo para tu montaje?",
      "cta.p": "Escríbeme por WhatsApp o rellena el formulario — presupuesto rápido y sin compromiso.",
      "cta.wa": "Escribir por WhatsApp",
      "footer.tagline": "Montaje de muebles en Málaga y toda la Costa del Sol.",
      "footer.zone": "📍 Málaga y Costa del Sol",
      "footer.rights": "Todos los derechos reservados.",
      "footer.legal": "Aviso legal",
      "footer.privacy": "Política de privacidad",
      "footer.cookies": "Política de cookies",
      "wa.message": "Hola! Quiero solicitar un montaje de muebles. "
    },
    en: {
      "nav.whatsapp": "WhatsApp",
      "hero.eyebrow": "Málaga · Marbella · Costa del Sol",
      "hero.h1": "Furniture assembly in Málaga, Marbella and Costa del Sol",
      "hero.sub": "Professional furniture assembler. IKEA, Leroy Merlin and any other brand. Guarantee included. Fast quote via WhatsApp.",
      "hero.cta_wa": "Message on WhatsApp",
      "hero.cta_form": "Get a quote",
      "services.eyebrow": "Services",
      "services.h2": "What I assemble",
      "services.p1": "I offer <strong>full kitchen assembly</strong>, <strong>wardrobes and walk-in closets</strong> (including IKEA PAX systems), <strong>height-adjustable desks</strong>, <strong>beds and children's bunk beds</strong>. For the living room, I assemble <strong>sofas, chairs, chests of drawers, vanities and shelving units</strong>, as well as <strong>TV wall mounts</strong> and <strong>garden and terrace furniture</strong>.",
      "services.p2": "I also assemble <strong>fitness equipment</strong> — treadmills, exercise bikes and strength stations — as well as <strong>office furniture</strong>: desks, chairs, filing cabinets and partitions.",
      "services.p3": "For businesses, I assemble <strong>commercial furnishings</strong>: shop shelving, counters, furniture for bars, restaurants, hotels and holiday apartments. I also work with <strong>nurseries, schools and academies</strong>, furnishing full classrooms.",
      "services.p4": "I work with furniture from <strong>IKEA, Leroy Merlin</strong> and any other brand. From a single piece to the <strong>complete furnishing of a home, office or business</strong> in Málaga, Marbella and across the Costa del Sol — with <strong>volume discounts</strong> for large orders: house moves, renovations, business openings or furnishing new apartments for investors and real estate agencies.",
      "gallery.eyebrow": "Recent work",
      "gallery.h2": "Before and after",
      "gallery.cama": "Bed assembly",
      "gallery.escritorio": "Desk assembly",
      "gallery.escritorio_reg": "Height-adjustable desk",
      "gallery.litera": "Bunk bed assembly",
      "gallery.sofa": "Sofa assembly",
      "gallery.sillas": "Chair assembly",
      "gallery.tocador": "Vanity assembly",
      "gallery.estanteria": "Shelving assembly",
      "gallery.jardin": "Garden furniture",
      "pricing.eyebrow": "Quote",
      "pricing.h2": "How we calculate your quote",
      "pricing.f1_h": "Location and distance",
      "pricing.f1_p": "The price varies by area: assembly in Málaga city is not the same as travelling to Marbella, Puerto Banús or Estepona.",
      "pricing.f2_h": "Type and number of pieces",
      "pricing.f2_p": "A single chair doesn't cost the same as a full kitchen. For several pieces at once, we apply a volume discount.",
      "pricing.f3_h": "Delivery of the furniture",
      "pricing.f3_p": "If the furniture is already at your home, assembly is faster. If you also need pickup and delivery, this is added to the quote.",
      "pricing.f4_h": "Access to the property",
      "pricing.f4_p": "A flat with no lift affects time and effort, especially with large pieces of furniture.",
      "pricing.f5_h": "Removal of old furniture",
      "pricing.f5_p": "If you need an old piece removed before assembling the new one, this work is included in the final quote.",
      "pricing.f6_h": "Urgency",
      "pricing.f6_p": "An assembly booked in advance is usually cheaper than a same-day urgent service.",
      "form.eyebrow": "Request",
      "form.h2": "Get a quote",
      "form.intro": "Every job is different, so the price is calculated individually. Fill in the form and we'll contact you to confirm the details: type of furniture, exact location, whether you need removal or delivery, and the number of pieces.",
      "form.name": "Name",
      "form.phone": "Phone",
      "form.postal": "Postcode",
      "form.promo": "Promo code",
      "form.optional": "(optional)",
      "form.consent": 'I have read and accept the <a href="privacidad.html">Privacy Policy</a>',
      "form.submit": "Request a quote",
      "form.sending": "Sending...",
      "form.success": "Thanks! We'll be in touch shortly.",
      "form.error": "Something went wrong. Please message us on WhatsApp.",
      "zone.eyebrow": "Coverage",
      "zone.h2": "Service area",
      "zone.p1": "<strong>Málaga city, Marbella, Puerto Banús, San Pedro de Alcántara, Torremolinos and Benalmádena.</strong>",
      "zone.p2": "I also work in Estepona, Fuengirola, Mijas, Benahavís, Rincón de la Victoria, Alhaurín de la Torre and Cártama.",
      "zone.p3": "For other towns in the province, get in touch and we'll check availability.",
      "zone.map_link": "View on Google Maps →",
      "faq.eyebrow": "FAQ",
      "faq.h2": "Frequently asked questions",
      "faq.q1": "How much does furniture assembly cost?",
      "faq.a1": "The price depends on the type, size and location. Fill in the form or message us on WhatsApp with a photo for a fast quote.",
      "faq.q2": "Do you assemble furniture of any brand?",
      "faq.a2": "Yes, IKEA, Leroy Merlin, Conforama and local manufacturers.",
      "faq.q3": "Do you work with businesses, hospitality or companies?",
      "faq.a3": "Yes, I work with offices, restaurants, hotels, holiday apartments, shops, nurseries and schools.",
      "faq.q4": "Can you assemble fitness equipment?",
      "faq.a4": "Yes, treadmills, exercise bikes and strength stations.",
      "faq.q5": "Is there a discount for large orders?",
      "faq.a5": "Yes, we apply volume discounts for house moves, renovations or full furnishing projects.",
      "faq.q6": "Do you work with real estate agencies?",
      "faq.a6": "Yes, I offer full furnishing for new apartments — ideal for investors and agencies.",
      "faq.q7": "Do I need to buy tools?",
      "faq.a7": "No, I bring my own tools.",
      "faq.q8": "Do you guarantee the assembly work?",
      "faq.a8": "Yes, every job includes a guarantee.",
      "faq.q9": "Do you work in Marbella and Puerto Banús?",
      "faq.a9": "Yes, I regularly work in Marbella, Puerto Banús and San Pedro de Alcántara.",
      "cta.h2": "Ready for your assembly?",
      "cta.p": "Message me on WhatsApp or fill in the form — fast, no-obligation quote.",
      "cta.wa": "Message on WhatsApp",
      "footer.tagline": "Furniture assembly in Málaga and across the Costa del Sol.",
      "footer.zone": "📍 Málaga and Costa del Sol",
      "footer.rights": "All rights reserved.",
      "footer.legal": "Legal notice",
      "footer.privacy": "Privacy policy",
      "footer.cookies": "Cookie policy",
      "wa.message": "Hi! I'd like to request a furniture assembly quote. "
    }
  };

  var currentLang = "es";

  /* ---------- LANGUAGE ---------- */
  function applyLanguage(lang) {
    currentLang = lang;
    var dict = translations[lang];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.documentElement.lang = lang;

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });

    updateWhatsappLinks();
    localStorage.setItem("armafix_lang", lang);
  }

  function initLanguage() {
    var buttons = document.querySelectorAll(".lang-btn");
    if (!buttons.length) return;

    var saved = null;
    try { saved = localStorage.getItem("armafix_lang"); } catch (e) {}
    var browserLang = navigator.language && navigator.language.toLowerCase().indexOf("en") === 0 ? "en" : "es";
    applyLanguage(saved || browserLang);

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang-btn"));
      });
    });
  }

  /* ---------- WHATSAPP LINKS ---------- */
  function updateWhatsappLinks() {
    var msg = encodeURIComponent(translations[currentLang]["wa.message"]);
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg;
    ["waHeaderBtn", "waHeroBtn", "waCtaBtn", "waFloatBtn"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute("href", url);
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var answer = item.querySelector(".faq-a");
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");

        items.forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------- FORM SUBMIT ---------- */
  function initForm() {
    var form = document.getElementById("quoteForm");
    if (!form) return;
    var status = document.getElementById("formStatus");
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        postal: form.postal.value.trim(),
        promo: form.promo.value.trim(),
        lang: currentLang,
        page: window.location.href,
        date: new Date().toISOString()
      };

      var dict = translations[currentLang];
      submitBtn.disabled = true;
      status.className = "form-status";
      status.textContent = dict["form.sending"];

      fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors", // Apps Script web apps typically require no-cors from the browser
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      })
        .then(function () {
          status.className = "form-status success";
          status.textContent = dict["form.success"];
          form.reset();
        })
        .catch(function () {
          status.className = "form-status error";
          status.textContent = dict["form.error"];
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* ---------- MISC ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initLanguage();
    initFaq();
    initForm();
    initYear();
  });
})();
