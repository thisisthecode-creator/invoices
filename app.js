// Invoice Generator - Live Preview
document.addEventListener('DOMContentLoaded', function() {
  console.log('Invoice Generator loaded');
  
  // Helper functions
  function $(id) {
    return document.getElementById(id);
  }
  
  function formatCurrency(value, currency = 'EUR') {
    const num = Number(value || 0);
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: currency 
    }).format(num);
  }
  
  function formatDate(date) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('de-DE');
  }
  
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + Number(days || 0));
    return result;
  }
  
  // Check if section has any content
  function hasContent(fields) {
    return fields.some(fieldId => {
      const element = $(fieldId);
      return element && element.value && element.value.trim() !== '';
    });
  }

  // Live preview update function
  function updatePreview() {
    console.log('Updating preview...');
    
    // Get current language for translations
    const currentLang = $('language-select').value || 'de';
    const texts = translations[currentLang] || translations['de'];
    
    // Basic info
    const number = $('invoice-number').value || '—';
    const date = $('invoice-date').value;
    const terms = $('invoice-terms').value || 14;
    const currency = $('invoice-currency').value || 'EUR';
    
    $('pv-number').textContent = number;
    $('pv-date').textContent = formatDate(date);
    
    if (date) {
      const dueDate = addDays(date, terms);
      $('pv-due').textContent = formatDate(dueDate);
    } else {
      $('pv-due').textContent = '—';
    }
    
    // Check if From section has content
    const fromFields = ['from-name', 'from-address', 'from-iban', 'from-bic', 'from-vat', 'from-email', 'from-phone'];
    const hasFromContent = hasContent(fromFields);
    
    if (hasFromContent) {
      $('from-to-section').style.display = 'grid';
      $('pv-addresses').style.display = 'grid';
      $('pv-from-section').style.display = 'block';
      
      // From fields - only show if they have content
      $('pv-from-name').textContent = $('from-name').value || '';
      $('pv-from-address').textContent = $('from-address').value || '';
      
      // Show IBAN and BIC in footer only if both have content
      const ibanValue = $('from-iban').value;
      const bicValue = $('from-bic').value;
      const bankDetailsElement = $('pv-bank-details');
      
      if (ibanValue && ibanValue.trim() !== '' && bicValue && bicValue.trim() !== '') {
        $('pv-from-name-bank').textContent = $('from-name').value || 'AMACON LLC';
        $('pv-from-iban').textContent = ibanValue.replace(/\s/g, '');
        $('pv-from-bic').textContent = bicValue;
        bankDetailsElement.style.display = 'block';
      } else {
        bankDetailsElement.style.display = 'none';
      }
      
      // Show EIN only if it has content
      const einValue = $('from-vat').value;
      const einElement = $('pv-from-vat').parentElement;
      if (einValue && einValue.trim() !== '') {
        $('pv-from-vat').textContent = einValue;
        einElement.style.display = 'block';
      } else {
        einElement.style.display = 'none';
      }
      
      // Show Email only if it has content
      const emailValue = $('from-email').value;
      const emailElement = $('pv-from-email-container');
      if (emailValue && emailValue.trim() !== '') {
        $('pv-from-email').textContent = emailValue;
        $('pv-from-email').href = `mailto:${emailValue}`;
        emailElement.style.display = 'block';
      } else {
        emailElement.style.display = 'none';
      }
      
      // Show Phone only if it has content
      const phoneValue = $('from-phone').value;
      const phoneElement = $('pv-from-phone-container');
      if (phoneValue && phoneValue.trim() !== '') {
        $('pv-from-phone').textContent = phoneValue;
        $('pv-from-phone').href = `tel:${phoneValue}`;
        phoneElement.style.display = 'block';
      } else {
        phoneElement.style.display = 'none';
      }
    } else {
      $('from-to-section').style.display = 'none';
      $('pv-from-section').style.display = 'none';
    }
    
    // CUSTOMER SECTION - Always show
    try {
      // Always show the sections
      const fromToSection = $('from-to-section');
      const pvAddresses = $('pv-addresses');
      const pvToSection = $('pv-to-section');
      
      if (fromToSection) fromToSection.style.display = 'grid';
      if (pvAddresses) pvAddresses.style.display = 'grid';
      if (pvToSection) pvToSection.style.display = 'block';
      
      // Customer Name - SUPER SIMPLE
      const toNameInput = document.getElementById('to-name');
      const toNamePreview = document.getElementById('pv-to-name');
      if (toNameInput && toNamePreview) {
        toNamePreview.textContent = toNameInput.value || '—';
      }
      
      // Customer Address - SUPER SIMPLE
      const toAddressInput = document.getElementById('to-address');
      const toAddressPreview = document.getElementById('pv-to-address');
      if (toAddressInput && toAddressPreview) {
        toAddressPreview.textContent = toAddressInput.value || '—';
      }
      
      // Tax ID - only show container if filled
      const toTaxInput = $('to-vat');
      const pvToVat = $('pv-to-vat');
      const pvToVatContainer = $('pv-to-vat-container');
      if (toTaxInput && pvToVat && pvToVatContainer) {
        const taxValue = toTaxInput.value || '';
        if (taxValue.trim()) {
          pvToVat.textContent = taxValue;
          pvToVatContainer.style.display = 'block';
        } else {
          pvToVatContainer.style.display = 'none';
        }
      }
      
      // Customer ID - only show container if filled
      const customerIdInput = $('to-customer-id');
      const pvCustomerId = $('pv-to-customer-id');
      const pvCustomerIdContainer = $('pv-to-customer-id-container');
      if (customerIdInput && pvCustomerId && pvCustomerIdContainer) {
        const custIdValue = customerIdInput.value || '';
        if (custIdValue.trim()) {
          pvCustomerId.textContent = custIdValue;
          pvCustomerIdContainer.style.display = 'block';
        } else {
          pvCustomerIdContainer.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('Error updating customer section:', error);
    }
    
    // Notes - only show if content exists
    const notes = $('invoice-notes').value;
    const notesElement = $('pv-notes');
    if (notes && notes.trim() !== '') {
      notesElement.textContent = notes;
      notesElement.style.display = 'block';
    } else {
      notesElement.style.display = 'none';
    }
    
    // Items calculation
    updateItems();
    
    // Payment buttons
    updatePaymentButtons();
    
    // Reverse charge notice
    updateReverseChargeNotice();
  }
  
  function updateItems() {
    const itemRows = document.querySelectorAll('.item-row');
    const rowsContainer = $('pv-rows');
    rowsContainer.innerHTML = '';

    let subtotal = 0;
    let totalTax = 0;
    const currency = $('invoice-currency').value || 'EUR';

    itemRows.forEach(row => {
      const descEl = row.querySelector('.i-desc');
      const subtitleEl = row.querySelector('.i-subtitle');
      const desc = (descEl && descEl.value) ? descEl.value.trim() : '';
      const subtitle = (subtitleEl && subtitleEl.value) ? subtitleEl.value.trim() : '';
      const qty = Number(row.querySelector('.i-qty').value || 0);
      const unit = row.querySelector('.i-unit').value || '';
      const price = Number(row.querySelector('.i-price').value || 0);
      const tax = Number(row.querySelector('.i-tax').value || 0);

      const lineNet = qty * price;
      const lineTax = lineNet * (tax / 100);
      subtotal += lineNet;
      totalTax += lineTax;

      // Full-width description row
      const descRow = document.createElement('div');
      descRow.className = 'row row-desc';
      descRow.innerHTML = `<div class="row-desc-cell">${escapeHtml(desc) || '—'}</div>`;
      rowsContainer.appendChild(descRow);

      // Full-width subtitle row (only if subtitle has content)
      if (subtitle) {
        const subRow = document.createElement('div');
        subRow.className = 'row row-subtitle';
        subRow.innerHTML = `<div class="row-subtitle-cell">${escapeHtml(subtitle)}</div>`;
        rowsContainer.appendChild(subRow);
      }

      // Details row: empty | qty | unit | price | tax | total
      const detailsRow = document.createElement('div');
      detailsRow.className = 'row row-details';
      detailsRow.innerHTML = `
        <div></div>
        <div>${qty}</div>
        <div>${unit}</div>
        <div class="cell right">${formatCurrency(price, currency)}</div>
        <div class="cell right">${tax.toFixed(1)}%</div>
        <div class="cell right">${formatCurrency(lineNet + lineTax, currency)}</div>
      `;
      rowsContainer.appendChild(detailsRow);
    });

    const total = subtotal + totalTax;
    $('pv-subtotal').textContent = formatCurrency(subtotal, currency);
    $('pv-tax').textContent = formatCurrency(totalTax, currency);
    $('pv-total').textContent = formatCurrency(total, currency);
  }
  
  function updatePaymentButtons() {
    console.log('=== updatePaymentButtons called ===');
    
    // Get payment links from inputs
    const paypalInput = $('paypal-link');
    const cardInput = $('card-link');
    
    console.log('Payment inputs:', {
      paypal: paypalInput ? paypalInput.value : 'NOT FOUND',
      card: cardInput ? cardInput.value : 'NOT FOUND'
    });
    
    const paymentMethods = [
      {
        id: 'paypal',
        name: 'PayPal',
        url: paypalInput ? paypalInput.value.trim() : '',
        class: 'paypal'
      },
      {
        id: 'card',
        name: 'Card Payment',
        url: cardInput ? cardInput.value.trim() : '',
        class: 'card'
      }
    ];
    
    // Get current language
    const currentLang = $('language-select') ? $('language-select').value : 'de';
    
    // Translate button names
    if (currentLang === 'de') {
      paymentMethods[1].name = 'Kartenzahlung';
    } else {
      paymentMethods[1].name = 'Card Payment';
    }
    
    // Get the payment buttons container
    const container = $('payment-buttons');
    console.log('Payment buttons container:', container);
    
    if (!container) {
      console.error('Payment buttons container NOT FOUND!');
      return;
    }
    
    // Clear existing buttons
    container.innerHTML = '';
    
    // Create buttons for methods with URLs
    let hasButtons = false;
    paymentMethods.forEach(method => {
      console.log(`Checking ${method.id}: url="${method.url}"`);
      if (method.url && method.url !== '') {
        hasButtons = true;
        const button = document.createElement('a');
        button.href = method.url;
        button.target = '_blank';
        button.rel = 'noreferrer noopener';
        button.className = `payment-button ${method.class}`;
        button.textContent = method.name;
        container.appendChild(button);
        console.log(`✓ Payment button created: ${method.name} (${method.url})`);
      }
    });
    
    // Show/hide payment section AND info box based on whether there are buttons
    const paymentInfo = $('payment-info');
    if (hasButtons) {
      container.style.display = 'flex';
      if (paymentInfo) {
        paymentInfo.style.display = 'block';
      }
      console.log('✓ Payment buttons container and info shown');
    } else {
      container.style.display = 'none';
      if (paymentInfo) {
        paymentInfo.style.display = 'none';
      }
      console.log('✗ Payment buttons container and info hidden (no buttons)');
    }
    
    console.log('=== Payment buttons update complete. Total buttons:', container.children.length, '===');
  }
  
  function updateReverseChargeNotice() {
    const showReverseCharge = $('show-reverse-charge').checked;
    const reverseChargeElement = $('pv-reverse-charge');

    console.log('Reverse charge checkbox checked:', showReverseCharge);
    
    // Always show if checkbox is checked (regardless of content)
    if (showReverseCharge) {
      reverseChargeElement.style.display = 'block';
      console.log('Reverse charge notice shown');
    } else {
      reverseChargeElement.style.display = 'none';
      console.log('Reverse charge notice hidden');
    }
  }
  
  // Add item row function – description and subtitle full row, then qty/unit/price/tax
  function addItemRow(data = {}) {
    const lang = ($('language-select') && $('language-select').value) || 'de';
    const texts = translations[lang] || translations['de'];
    const descPlaceholder = texts['desc-placeholder'] || 'Beschreibung';
    const subtitlePlaceholder = texts['subtitle-placeholder'] || 'Untertitel (optional)';

    const itemsContainer = $('items');
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <div class="item-desc-row">
        <textarea class="i-desc" placeholder="${escapeHtml(descPlaceholder)}" rows="2">${escapeHtml(data.description || '')}</textarea>
      </div>
      <div class="item-subtitle-row">
        <input class="i-subtitle" type="text" placeholder="${escapeHtml(subtitlePlaceholder)}" value="${escapeHtml(data.subtitle || '')}" />
      </div>
      <div class="item-details-row">
        <div class="item-details-spacer"></div>
        <input class="i-qty" type="number" min="0" step="1" value="${data.quantity ?? 1}" placeholder="0">
        <input class="i-unit" placeholder="Stk" value="${data.unit || 'Stk'}">
        <input class="i-price" type="number" min="0" step="0.01" value="${data.price ?? 0}" placeholder="0">
        <input class="i-tax" type="number" min="0" max="100" step="0.1" value="${data.tax ?? 0}" placeholder="0">
        <button class="btn btn-icon i-del" type="button" title="Remove line" aria-label="Remove line">×</button>
      </div>
    `;

    itemsContainer.appendChild(row);

    const inputs = row.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });

    row.querySelector('.i-del').addEventListener('click', () => {
      row.remove();
      updatePreview();
    });

    updatePreview();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /** Parse invoice number (e.g. INV-2026-1138), add 1 to the last numeric part, update input and preview. */
  function incrementInvoiceNumber() {
    const input = $('invoice-number');
    if (!input) return;
    const value = (input.value || '').trim();
    const match = value.match(/^(.+?)(\d+)$/);
    if (!match) return;
    const prefix = match[1];
    const num = parseInt(match[2], 10);
    const nextNum = num + 1;
    const padded = match[2].startsWith('0') && match[2].length > 1
      ? String(nextNum).padStart(match[2].length, '0')
      : String(nextNum);
    input.value = prefix + padded;
    updatePreview();
  }
  
  // IBAN formatting function
  function formatIBAN(value) {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Format as BE63 9054 8898 6808 (4 chars, space, 4 chars, space, 4 chars, space, 4 chars)
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
    if (cleaned.length <= 12) return cleaned.slice(0, 4) + ' ' + cleaned.slice(4, 8) + ' ' + cleaned.slice(8);
    return cleaned.slice(0, 4) + ' ' + cleaned.slice(4, 8) + ' ' + cleaned.slice(8, 12) + ' ' + cleaned.slice(12, 16);
  }

  // Event listeners
  function setupEventListeners() {
    // All form inputs
    const inputIds = [
      'invoice-number', 'invoice-date', 'invoice-terms', 'invoice-currency',
      'from-name', 'from-address', 'from-iban', 'from-bic', 'from-vat',
      'from-email', 'from-phone', 'to-name', 'to-address', 'to-vat', 'to-customer-id',
      'to-email', 'invoice-notes',
      'show-reverse-charge'
    ];
    
    inputIds.forEach(id => {
      const element = $(id);
      if (element) {
        element.addEventListener('input', updatePreview);
        element.addEventListener('change', updatePreview);
        element.addEventListener('keyup', updatePreview);
        console.log(`✓ Event listeners set up for: ${id}`);
      } else {
        console.error(`✗ Element NOT FOUND: ${id}`);
      }
    });
    
    // Special handling for payment link inputs - need immediate update
    const paymentLinkIds = ['paypal-link', 'card-link'];
    paymentLinkIds.forEach(id => {
      const element = $(id);
      if (element) {
        console.log(`Setting up event listeners for ${id}`);
        element.addEventListener('input', function(e) {
          console.log(`${id} input event:`, e.target.value);
          updatePaymentButtons();
        });
        element.addEventListener('change', function(e) {
          console.log(`${id} change event:`, e.target.value);
          updatePaymentButtons();
        });
        element.addEventListener('keyup', function(e) {
          console.log(`${id} keyup event:`, e.target.value);
          updatePaymentButtons();
        });
        element.addEventListener('paste', function(e) {
          console.log(`${id} paste event`);
          setTimeout(() => {
            console.log(`${id} after paste:`, e.target.value);
            updatePaymentButtons();
          }, 10);
        });
      } else {
        console.error(`Payment input ${id} NOT FOUND!`);
      }
    });
    
    // Special handling for reverse charge checkbox
    const reverseChargeCheckbox = $('show-reverse-charge');
    if (reverseChargeCheckbox) {
      reverseChargeCheckbox.addEventListener('change', function() {
        console.log('Reverse charge checkbox changed');
        updateReverseChargeNotice();
      });
    }
    
    // Special IBAN formatting
    const ibanInput = $('from-iban');
    if (ibanInput) {
      ibanInput.addEventListener('input', function(e) {
        const formatted = formatIBAN(e.target.value);
        e.target.value = formatted;
        updatePreview();
      });
    }
    
    // Add item button
    $('add-item').addEventListener('click', () => addItemRow());
    
    // Print / Export PDF: after dialog closes, increment invoice number
    $('btn-print').addEventListener('click', () => {
      window.print();
      const onceAfterPrint = () => {
        incrementInvoiceNumber();
        window.removeEventListener('afterprint', onceAfterPrint);
      };
      window.addEventListener('afterprint', onceAfterPrint);
    });
    
    // Logo upload
    $('logo-input').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const logoContainer = $('invoice-logo');
        logoContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Logo';
        img.style.maxWidth = '120px';
        img.style.maxHeight = '80px';
        logoContainer.appendChild(img);
      }
    });
  }
  
  // Language translations
  const translations = {
    de: {
      'invoice-title': 'Rechnung',
      'invoice-details-title': 'Rechnungsdetails',
      'invoice-number-label': 'Rechnungsnummer',
      'invoice-date-label': 'Datum',
      'invoice-terms-label': 'Zahlungsbedingungen',
      'invoice-currency-label': 'Währung',
      'from-title': 'Von (Ihr Unternehmen)',
      'company-name-label': 'Firmenname',
      'address-label': 'Adresse',
      'tax-id-label': 'EIN',
      'email-label': 'E-Mail',
      'phone-label': 'Telefon',
      'to-title': 'An (Kunde)',
      'customer-name-label': 'Kundenname',
      'customer-address-label': 'Adresse',
      'customer-id-label': 'Kunden-ID',
      'line-items-title': 'Positionen',
      'add-item-text': 'Position hinzufügen',
      'desc-placeholder': 'Beschreibung',
      'subtitle-placeholder': 'Untertitel (optional)',
      'notes-label': 'Notizen',
      'legal-notices-title': 'Rechtliche Hinweise',
      'reverse-charge-text': 'Hinweis: UStG §13b gilt – die Umsatzsteuer ist vom Leistungsempfänger zu entrichten (Reverse-Charge-Verfahren).',
      'payment-methods-title': 'Zahlungsmethoden',
      'card-payment-label': 'Kartenzahlung Link (optional)',
      'sepa-pay-label': 'SEPA Zahlungs-Link (optional)',
      'logo-title': 'Logo',
      'logo-upload-text': 'Optional: PNG/SVG hochladen. Platzhalter wird sonst verwendet.',
      'from-section-title': 'Absender',
      'to-section-title': 'Empfänger',
      'subtotal': 'Zwischensumme',
      'tax': 'Steuer',
      'total': 'Gesamt',
      'thank-you': 'Vielen Dank für Ihr Vertrauen.',
      'default-item': 'Dienstleistung',
      'default-unit': 'Stk',
      'payment-info': 'Die Rechnung jetzt gleich direkt über folgende Zahlungsmethoden begleichen:'
    },
    en: {
      'invoice-title': 'Invoice',
      'invoice-details-title': 'Invoice Details',
      'invoice-number-label': 'Invoice Number',
      'invoice-date-label': 'Date',
      'invoice-terms-label': 'Payment Terms',
      'invoice-currency-label': 'Currency',
      'from-title': 'From (Your Company)',
      'company-name-label': 'Company Name',
      'address-label': 'Address',
      'tax-id-label': 'EIN',
      'email-label': 'Email',
      'phone-label': 'Phone',
      'to-title': 'To (Customer)',
      'customer-name-label': 'Customer Name',
      'customer-address-label': 'Address',
      'customer-id-label': 'Customer ID',
      'line-items-title': 'Line Items',
      'add-item-text': 'Add Item',
      'desc-placeholder': 'Description',
      'subtitle-placeholder': 'Subtitle (optional)',
      'notes-label': 'Notes',
      'legal-notices-title': 'Legal Notices',
      'reverse-charge-text': 'Note: UStG §13b applies – VAT is to be paid by the service recipient (reverse charge procedure).',
      'payment-methods-title': 'Payment Methods',
      'card-payment-label': 'Card Payment Link (optional)',
      'sepa-pay-label': 'SEPA Payment Link (optional)',
      'logo-title': 'Logo',
      'logo-upload-text': 'Optional: Upload PNG/SVG. Placeholder will be used otherwise.',
      'from-section-title': 'From',
      'to-section-title': 'To',
      'subtotal': 'Subtotal',
      'tax': 'Tax',
      'total': 'Total',
      'thank-you': 'Thank you for your trust.',
      'default-item': 'Service',
      'default-unit': 'pcs',
      'payment-info': 'You can pay this invoice directly using the following payment methods:'
    }
  };

  // Update PDF labels function
  function updatePDFLabels(lang, texts) {
    console.log('Updating PDF labels for language:', lang);
    
    // Update section headers
    const fromSection = $('from-section-title');
    const toSection = $('to-section-title');
    
    if (fromSection) {
      fromSection.textContent = lang === 'de' ? 'Absender' : 'From';
      console.log('Updated from section:', fromSection.textContent);
    }
    if (toSection) {
      toSection.textContent = lang === 'de' ? 'Empfänger' : 'To';
      console.log('Updated to section:', toSection.textContent);
    }
    
    // Update payment method labels
    const paypalLink = $('pv-paypal');
    const cardLink = $('pv-card');
    const sepaLink = $('pv-sepa');
    
    if (paypalLink) paypalLink.textContent = 'PayPal';
    if (cardLink) {
      cardLink.textContent = lang === 'de' ? 'Karte' : 'Card';
      console.log('Updated card link:', cardLink.textContent);
    }
    if (sepaLink) sepaLink.textContent = 'SEPA';
    
    // Update totals labels using IDs
    const subtotalLabel = $('pv-subtotal-label');
    const taxLabel = $('pv-tax-label');
    const totalLabel = $('pv-total-label');
    
    if (subtotalLabel) {
      subtotalLabel.textContent = texts['subtotal'] || 'Zwischensumme';
      console.log('Updated subtotal label:', subtotalLabel.textContent);
    }
    if (taxLabel) {
      taxLabel.textContent = texts['tax'] || 'Steuer';
      console.log('Updated tax label:', taxLabel.textContent);
    }
    if (totalLabel) {
      totalLabel.textContent = texts['total'] || 'Gesamt';
      console.log('Updated total label:', totalLabel.textContent);
    }
    
    // Update date and due labels using IDs
    const dateLabel = $('pv-date-label');
    const dueLabel = $('pv-due-label');
    
    if (dateLabel) {
      const dateValue = $('pv-date').textContent;
      dateLabel.textContent = (lang === 'de' ? 'Datum: ' : 'Date: ') + dateValue;
      console.log('Updated date label:', dateLabel.textContent);
    }
    if (dueLabel) {
      const dueValue = $('pv-due').textContent;
      dueLabel.textContent = (lang === 'de' ? 'Fällig am: ' : 'Due: ') + dueValue;
      console.log('Updated due label:', dueLabel.textContent);
    }
    
    // Update invoice title using ID
    const invoiceTitle = $('pv-invoice-title');
    if (invoiceTitle) {
      invoiceTitle.textContent = lang === 'de' ? 'Rechnung' : 'Invoice';
      console.log('Updated invoice title:', invoiceTitle.textContent);
    }
    
    // Update reverse charge notice using ID
    const reverseChargeText = $('pv-reverse-charge-text');
    if (reverseChargeText) {
      reverseChargeText.innerHTML = texts['reverse-charge-text'] || 'Hinweis: UStG §13b gilt – die Umsatzsteuer ist vom Leistungsempfänger zu entrichten (Reverse-Charge-Verfahren).';
      console.log('Updated reverse charge text');
    }
    
    // Update thank you message
    const thankYouElement = document.querySelector('.thank-you');
    if (thankYouElement) {
      thankYouElement.textContent = texts['thank-you'] || 'Vielen Dank für Ihr Vertrauen.';
      console.log('Updated thank you message');
    }
    
    console.log('PDF labels updated successfully for language:', lang);
  }

  // Language functions
  function updateLanguage(lang) {
    console.log('Updating language to:', lang);
    const texts = translations[lang];
    if (!texts) {
      console.log('No translations found for:', lang);
      return;
    }
    
    // Update all text elements
    Object.keys(texts).forEach(key => {
      const element = $(key);
      if (element) {
        element.textContent = texts[key];
        console.log('Updated:', key, 'to:', texts[key]);
      } else {
        console.log('Element not found:', key);
      }
    });
    
    // Update specific elements with IDs
    if (lang === 'de') {
      if ($('from-section-title')) $('from-section-title').textContent = 'Absender';
      if ($('to-section-title')) $('to-section-title').textContent = 'Empfänger';
    } else {
      if ($('from-section-title')) $('from-section-title').textContent = 'From';
      if ($('to-section-title')) $('to-section-title').textContent = 'To';
    }
    
    // Update default item description
    const defaultItem = document.querySelector('.i-desc');
    if (defaultItem && (defaultItem.value === 'Dienstleistung' || defaultItem.value === 'Service')) {
      defaultItem.value = texts['default-item'];
    }
    
    // Update preview elements that need translation
    updatePreview();
    
    // Update payment buttons to reflect new language
    updatePaymentButtons();
  }

  // Initialize
  function init() {
    console.log('Initializing...');
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    $('invoice-date').value = today;
    
    // Logo: always use BenefitLogo2.png (top left)
    const logoContainer = $('invoice-logo');
    if (logoContainer) {
      logoContainer.innerHTML = '';
      const logoImg = document.createElement('img');
      logoImg.src = 'BenefitLogo2.png';
      logoImg.alt = 'Logo';
      logoImg.style.maxWidth = '120px';
      logoImg.style.maxHeight = '80px';
      logoContainer.appendChild(logoImg);
    }
    
    // Set company data (Absender preset)
    $('from-name').value = 'AMACON LLC';
    $('from-address').value = '4300 Ridgecrest Drive SE\n87124 Rio Rancho, NM\nUSA';
    $('from-iban').value = 'BE08 9671 4938 4713';
    $('from-bic').value = 'TRWIBEB1XXX';
    $('from-vat').value = '61-1972863';
    $('from-email').value = 'office@amacon.llc';
    $('from-phone').value = '+15052344946';
    
    // Add default item
    addItemRow({ 
      description: 'Dienstleistung', 
      quantity: 1, 
      unit: 'Stk', 
      price: 100, 
      tax: 0 
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Language selector
    $('language-select').addEventListener('change', function(e) {
      console.log('Language changed to:', e.target.value);
      updateLanguage(e.target.value);
      
      // Force update preview after language change
      setTimeout(() => {
        const currentLang = e.target.value;
        const texts = translations[currentLang] || translations['de'];
        updatePDFLabels(currentLang, texts);
        console.log('Forced preview update for language:', currentLang);
      }, 200);
    });
    
    // Initial language update - set to German by default
    $('language-select').value = 'de';
    updateLanguage('de');
    
    // Initial preview update
    updatePreview();
    
    // Force update payment buttons after initial load
    setTimeout(() => {
      console.log('Forcing payment buttons update after init...');
      updatePaymentButtons();
    }, 100);
    
    // Force update preview again after a delay to catch any late-loading values
    setTimeout(() => {
      console.log('Forcing second preview update after init...');
      updatePreview();
    }, 200);
    
    console.log('Invoice Generator initialized successfully');
  }
  
  // Start the app
  init();
});