
import { Booking, BookingStatus, Villa } from '../../types';

// --- CONFIGURATION ---
// En prod, ceci viendrait de la BDD (Table Settings)
const SEASON_CONFIG = {
    HIGH: { months: [6, 7], multiplier: 1.4 }, // Juillet (6), Août (7) - JS months are 0-indexed
    SHOULDER: { months: [5, 8], multiplier: 1.2 }, // Juin (5), Sept (8)
    LOW: { months: [0, 1, 2, 3, 4, 9, 10, 11], multiplier: 1.0 }
};

const DISCOUNTS = {
    LONG_STAY_THRESHOLD: 7, // nuits
    LONG_STAY_PERCENT: 0.10 // 10%
};

const FEES = {
    CLEANING_PER_STAY: 80,
    TAX_PERCENT: 0.10
};

// --- UTILS ---

export const toDate = (dateStr: string | Date): Date => {
    return new Date(dateStr);
};

export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const getDaysDiff = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// --- CORE LOGIC ---

/**
 * Vérifie si une plage de dates est disponible pour une villa.
 * Vérification stricte contre les réservations CONFIRMED, CHECKED_IN, ou PENDING existantes.
 */
export const checkAvailability = (
    villaId: string, 
    startDate: string, 
    endDate: string, 
    allBookings: Booking[],
    excludeBookingId?: string
): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return !allBookings.some(b => {
        if (b.villaId !== villaId) return false;
        if (b.status === BookingStatus.CANCELLED) return false;
        if (excludeBookingId && b.id === excludeBookingId) return false;

        const bStart = new Date(b.startDate);
        const bEnd = new Date(b.endDate);

        // Logique de chevauchement : (StartA < EndB) et (EndA > StartB)
        return start < bEnd && end > bStart;
    });
};

/**
 * Calcule le prix précis pour un séjour basé sur la saisonnalité et les règles.
 */
export const calculateStayPrice = (
    villa: Villa, 
    startDate: Date, 
    endDate: Date
) => {
    let accommodationTotal = 0;
    let nights = 0;
    let curr = new Date(startDate);
    
    // Copie pour éviter de modifier la date originale
    const end = new Date(endDate);

    while (curr < end) {
        const month = curr.getMonth();
        let nightlyRate = villa.pricePerNight;

        if (SEASON_CONFIG.HIGH.months.includes(month)) {
            nightlyRate *= SEASON_CONFIG.HIGH.multiplier;
        } else if (SEASON_CONFIG.SHOULDER.months.includes(month)) {
            nightlyRate *= SEASON_CONFIG.SHOULDER.multiplier;
        }

        accommodationTotal += nightlyRate;
        nights++;
        curr.setDate(curr.getDate() + 1);
    }

    // Appliquer Remises
    let discountAmount = 0;
    if (nights >= DISCOUNTS.LONG_STAY_THRESHOLD) {
        discountAmount = accommodationTotal * DISCOUNTS.LONG_STAY_PERCENT;
    }

    // Taxes & Frais
    const cleaningFee = FEES.CLEANING_PER_STAY;
    const subtotalAfterDiscount = accommodationTotal - discountAmount;
    const taxes = subtotalAfterDiscount * FEES.TAX_PERCENT;
    const total = subtotalAfterDiscount + cleaningFee + taxes;

    return {
        nights,
        baseTotal: accommodationTotal,
        discount: discountAmount,
        cleaningFee,
        taxes,
        total: Math.round(total), // Arrondi à l'entier le plus proche pour l'UI
        isLongStay: nights >= DISCOUNTS.LONG_STAY_THRESHOLD
    };
};

/**
 * Génère un code porte unique basé sur l'ID de réservation (Simulation de hachage).
 */
export const generateDoorCode = (bookingId: string): string => {
    let hash = 0;
    for (let i = 0; i < bookingId.length; i++) {
        hash = ((hash << 5) - hash) + bookingId.charCodeAt(i);
        hash |= 0;
    }
    const code = Math.abs(hash).toString().slice(0, 4).padEnd(4, '0');
    return code;
};
