'use client';

export async function svgToPngDataUrl(
    svgEl: SVGSVGElement,
    scale = 3
): Promise<string | null> {
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    const img = new Image();
    // use rendered size or a sane default
    img.width = svgEl.clientWidth || 220;
    img.height = svgEl.clientHeight || 220;

    return new Promise((resolve) => {
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(null);

            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            resolve(canvas.toDataURL('image/png'));
        };
        img.src = svgDataUrl;
    });
}

export async function qrWrapperToPngDataUrl(
    wrapperEl: HTMLElement,
    scale = 3
): Promise<string | null> {
    const svg = wrapperEl.querySelector('svg') as SVGSVGElement | null;
    if (!svg) return null;
    return svgToPngDataUrl(svg, scale);
}
