export function CreateCircle(canvasName, w, h, Radius_Mill, cCircle = SVG.Color.random(), cTitle = SVG.Color.random()) {

    if (!Radius_Mill || Radius_Mill <= 0) return;

    const mCircle = canvasName.circle()
        .radius(Radius_Mill)
        .center(0, 0)
        .fill('none')
        .addClass('mbCircle')
        .stroke({ color: cCircle });

    function Point_st(L) { return -L / 2 + 10; }
    function Point_end(L) { return L / 2 - 10; }
}

//export {CreateCircle}