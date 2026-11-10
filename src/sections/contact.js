import { contact } from '../data/site.js';
import { arrowIcon, list } from '../core/dom.js';

export const contactTemplate = () => `
  <section class="contact-section" id="contact">
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="want to know more?">want to know more?</p>
      <h2 class="section-title">CONTACT</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-col reveal">
        <p class="contact-kicker">Write to us</p>
        <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>
        <ul class="contact-phones">${list(contact.phones, ({ name, role, tel, display }) => `
          <li>
            <span class="contact-person">${name}<em>${role}</em></span>
            <a href="tel:${tel}">${display}</a>
          </li>`)}
        </ul>
      </div>
      <div class="contact-col reveal">
        <p class="contact-kicker">Follow us</p>
        <ul class="contact-socials">${list(contact.socials, ({ name, url }) => `
          <li><a href="${url}" target="_blank" rel="noopener">${name} ${arrowIcon}</a></li>`)}
        </ul>
        <p class="contact-address">${contact.address.join('<br />')}</p>
      </div>
    </div>
  </section>`;

export const footerTemplate = () => `
  <footer class="footer">
    <span class="footer-text">developed with absolutely no love by debraj</span>
    <span class="footer-brand">KRATOS</span>
  </footer>`;
