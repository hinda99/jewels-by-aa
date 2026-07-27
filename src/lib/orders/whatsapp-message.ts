import { WhatsAppMessageInput } from '@/types/order';

export function buildLocalizedWhatsAppMessage(input: WhatsAppMessageInput): string {
  const { locale, customer, lines, subtotalMad, reference, privacyMode } = input;

  const isArabic = locale === 'ar';
  const isEnglish = locale === 'en';

  const currencyStr = 'MAD';

  let header = `🛍️ Nouvelle commande — #${reference}`;
  if (isArabic) {
    header = `🛍️ طلب جديد — #${reference}`;
  } else if (isEnglish) {
    header = `🛍️ New Order — #${reference}`;
  }

  let customerHeader = 'CLIENT';
  let nameLabel = 'Nom';
  let phoneLabel = 'Téléphone';
  let cityLabel = 'Ville';
  let addressLabel = 'Adresse';
  let notesLabel = 'Notes';

  let itemsHeader = 'ARTICLES';
  let variantLabelHeader = 'Variante';
  let skuLabelHeader = 'Référence';
  let priceLabelHeader = 'Prix unitaire';
  let qtyLabelHeader = 'Quantité';
  let totalLabelHeader = 'Total';

  let subtotalLabel = 'SOUS-TOTAL';
  let deliveryLabel = 'LIVRAISON';
  let deliveryMsg = 'À confirmer sur WhatsApp';
  let totalBeforeDeliveryLabel = 'TOTAL AVANT LIVRAISON';
  let footerMsg = 'Merci de confirmer la disponibilité et les frais de livraison.';

  if (isArabic) {
    customerHeader = 'معلومات الزبون';
    nameLabel = 'الاسم';
    phoneLabel = 'الهاتف';
    cityLabel = 'المدينة';
    addressLabel = 'العنوان';
    notesLabel = 'ملاحظات';

    itemsHeader = 'المنتجات';
    variantLabelHeader = 'الخيار';
    skuLabelHeader = 'الرمز';
    priceLabelHeader = 'الثمن الفردي';
    qtyLabelHeader = 'الكمية';
    totalLabelHeader = 'المجموع';

    subtotalLabel = 'المجموع الفرعي';
    deliveryLabel = 'التوصيل';
    deliveryMsg = 'سيتم التأكيد عبر واتساب';
    totalBeforeDeliveryLabel = 'المجموع قبل التوصيل';
    footerMsg = 'يرجى تأكيد التوفر ومصاريف التوصيل.';
  } else if (isEnglish) {
    customerHeader = 'CUSTOMER';
    nameLabel = 'Name';
    phoneLabel = 'Phone';
    cityLabel = 'City';
    addressLabel = 'Address';
    notesLabel = 'Notes';

    itemsHeader = 'ITEMS';
    variantLabelHeader = 'Option';
    skuLabelHeader = 'SKU';
    priceLabelHeader = 'Unit Price';
    qtyLabelHeader = 'Quantity';
    totalLabelHeader = 'Total';

    subtotalLabel = 'SUBTOTAL';
    deliveryLabel = 'DELIVERY';
    deliveryMsg = 'To be confirmed on WhatsApp';
    totalBeforeDeliveryLabel = 'TOTAL BEFORE DELIVERY';
    footerMsg = 'Please confirm availability and delivery fee.';
  }

  const customerLines = [
    `${nameLabel} : ${customer.name}`,
    `${phoneLabel} : ${customer.phone}`,
    `${cityLabel} : ${customer.city}`,
  ];

  if (privacyMode === 'full') {
    customerLines.push(`${addressLabel} : ${customer.address}`);
    if (customer.notes) {
      customerLines.push(`${notesLabel} : ${customer.notes}`);
    }
  } else {
    customerLines.push(
      isArabic
        ? 'سيتم تأكيد العنوان الكامل عبر المحادثة.'
        : 'Full address will be confirmed in chat.'
    );
  }

  const itemsFormatted = lines
    .map((line, index) => {
      return [
        `${index + 1}. ${line.name}`,
        `   ${variantLabelHeader} : ${line.variantLabel}`,
        `   ${skuLabelHeader} : ${line.sku}`,
        `   ${priceLabelHeader} : ${line.unitPriceMad} ${currencyStr}`,
        `   ${qtyLabelHeader} : ${line.quantity}`,
        `   ${totalLabelHeader} : ${line.lineTotalMad} ${currencyStr}`,
      ].join('\n');
    })
    .join('\n\n');

  return [
    header,
    '',
    `--- ${customerHeader} ---`,
    customerLines.join('\n'),
    '',
    `--- ${itemsHeader} ---`,
    itemsFormatted,
    '',
    `--------------------------`,
    `${subtotalLabel} : ${subtotalMad} ${currencyStr}`,
    `${deliveryLabel} : ${deliveryMsg}`,
    `${totalBeforeDeliveryLabel} : ${subtotalMad} ${currencyStr}`,
    '',
    footerMsg,
  ].join('\n');
}

export function buildWaMeUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
