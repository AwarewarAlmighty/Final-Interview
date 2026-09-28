export function filterWorkshops(workshops, category = 'All', day = 'All') {
    return workshops.filter((workshop) => {
        const matchesCategory = category === 'All' || workshop.category === category;
        const matchesDay = day === 'All' || workshop.day === day;
        return matchesCategory && matchesDay;
    });
}

export function reserveSeat(workshop) {
    return { ...workshop, seatsLeft: Math.max(0, workshop.seatsLeft - 1) };
}