const palettes = [
    ['#CAE56A', '#86A220', '#4A8024', '#265A6F', '#071D26'],
    ['#6AA3E5', '#1A4C86', '#0C28B6', '#411193', '#120726'],
    ['#E56A87', '#9C1333', '#C32502', '#BC5302', '#261407'],
    ['#1B264F', '#274690', '#576CA8', '#302B27', '#F5F3F5'],
];

export default () => palettes[Math.floor(Math.random() * palettes.length)];