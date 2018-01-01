const palettes = [
    // Generated via http://colormind.io/template/paper-dashboard/
    ['#CAE56A', '#86A220', '#4A8024', '#265A6F', '#071D26'],
    ['#6AA3E5', '#1A4C86', '#0C28B6', '#411193', '#120726'],
    ['#E56A87', '#9C1333', '#C32502', '#BC5302', '#261407'],
    ['#1B264F', '#274690', '#576CA8', '#302B27', '#F5F3F5'],
    ['#EFE9E1', '#958E80', '#904E20', '#957D53', '#171516'],
    ['#EAECE8', '#89B6A2', '#A18D51', '$969E9A', '#455870'],
    ['#F9FBFA', '#AD9D96', '#DDB69C', '#E3857D', '#F36812'],
    ['#EBF0F0', '#848979', '#88A79B', '#715E5D', '#15324F'],
];

export default () => palettes[Math.floor(Math.random() * palettes.length)];