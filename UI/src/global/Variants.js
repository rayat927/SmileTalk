const box = {
    i: {
        opacity: 0,
        marginLeft: "100px"
    },
    a: {
        opacity: 1,
        marginLeft: "0px"
    },
    x: {
        opacity: 0,
        marginLeft: "-100px"
    }
}

const child = {
    i: {
        opacity: 0,
    },
    a: {
        opacity: 1,
    },
    x: {
        opacity: 0,
    } 
}

const slideInLeft = {
    i: {
        opacity: 0, 
        x: -20
    },
    a: {
        opacity: 1, 
        x: 0
    },
    x: {
        opacity: 0,
        x: 20
    },
    tr: {
        delay: 0.3
    }
}

const slideInRight = {
    i: {
        opacity: 0, 
        x: 20
    },
    a: {
        opacity: 1, 
        x: 0
    },
    x: {
        opacity: 0,
        x: -20
    },
    tr: {
        duration: 0.1
    }
}

export { box, child, slideInLeft, slideInRight }