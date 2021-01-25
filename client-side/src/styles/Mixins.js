// general mixins
export const flex = (align_dir = `center`, justify_dir = `center`) => {
    return `display: flex;
            ${align_dir ? `align-items: ${align_dir}` : `` };
            ${justify_dir ? `justify-content: ${justify_dir}` : `` };`;
}

export const position = (pos , top, buttom, right, left) => {
    return `position: ${pos};
            ${top ? `top: ${top}` : ``};
            ${buttom ? `buttom: ${buttom}` : ``};
            ${right ? `right: ${right}` : ``};
            ${left ? `left: ${left}` : ``};`;
}

export const cool_shining_green = () => {
    return `-webkit-box-shadow: 2px 3px 16px 5px rgba(0,255,65,0.75); 
            box-shadow: 2px 3px 16px 5px rgba(0,255,65,0.75);`;
}

