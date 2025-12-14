
import { jsPDF } from 'jspdf';
import { Booking, Villa } from '../../types';

export const generateRentalContract = (booking: Booking, villa: Villa, clientName: string) => {
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setFont('times', 'bold');
    doc.text("CONTRAT DE LOCATION SAISONNIÈRE", 105, y, { align: 'center' });
    y += 20;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Parties
    doc.setFont('helvetica', 'bold');
    doc.text("ENTRE LES SOUSSIGNÉS :", 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text("La société TETOUAN LUXURY VILLAS, Route de Sebta, Tétouan.", 20, y);
    y += 10;
    doc.text("Ci-après dénommé le « Bailleur »,", 20, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text("ET :", 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`M./Mme ${clientName}`, 20, y);
    doc.text(`Email: ${booking.clientEmail}`, 20, y + 6);
    y += 20;

    // Objet
    doc.setFont('helvetica', 'bold');
    doc.text("IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT :", 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Le Bailleur donne en location au Preneur, qui accepte, la villa meublée suivante :`, 20, y);
    y += 8;
    doc.text(`Nom de la propriété : ${villa.name}`, 30, y);
    doc.text(`Capacité : ${villa.bedrooms} chambres, ${villa.bathrooms} salles de bain, Piscine privée.`, 30, y + 6);
    y += 20;

    // Dates & Prix
    doc.setFont('helvetica', 'bold');
    doc.text("DURÉE ET PRIX :", 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Date d'arrivée : ${booking.startDate} à partir de 15h00`, 30, y);
    doc.text(`Date de départ : ${booking.endDate} avant 11h00`, 30, y + 6);
    doc.text(`Prix total du séjour : ${booking.totalPrice} EUR (Taxes incluses)`, 30, y + 12);
    y += 25;

    // Règles
    doc.setFontSize(10);
    doc.text("CONDITIONS GÉNÉRALES :", 20, y);
    y += 6;
    const rules = [
        "1. Le Preneur s'engage à user des lieux en 'bon père de famille'.",
        "2. Interdiction formelle d'organiser des fêtes ou événements bruyants.",
        "3. Le nombre d'occupants ne doit pas dépasser la capacité indiquée.",
        "4. Une caution de 500 EUR est bloquée sur carte bancaire.",
        "5. Il est interdit de fumer à l'intérieur de la villa."
    ];
    rules.forEach(rule => {
        doc.text(rule, 20, y);
        y += 6;
    });

    y += 20;
    doc.setFontSize(12);
    doc.text("Fait à Tétouan, le " + new Date().toLocaleDateString(), 20, y);
    y += 20;

    doc.text("Le Bailleur", 20, y);
    doc.text("Le Preneur (Signature numérique)", 120, y);
    doc.text("(Signé électroniquement)", 120, y + 10);

    // Save
    doc.save(`Contrat_Location_${booking.id}.pdf`);
};
