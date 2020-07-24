console.log("%cStop using the console!", "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");

/**
 * Dragging 
 */
// const position = { x: 0, y: 0 }

interact('.program-modal').draggable({
    allowFrom: '.program-header',
    modifiers: [
        interact.modifiers.restrictEdges({
            outer: {
                top: 30, // the left edge must be >= 0
            },
        })
    ],
    listeners: {
        move(event) {
            let target = event.target;

            let { x, y } = target.dataset

            putOnTop(target);

            if (target.classList.contains('fullscreen')) {
                removeClass(target, 'fullscreen');
                target.style.transform = 'none';
                x = 0;
                y = 0;
            } else {
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            }

            // translate the element
            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
    }
})

/**
 * Resize
 */
interact('.program-modal')
    .resizable({
        edges: {
            top: false,       // Use pointer coords to check for resize.
            left: true,      // Disable resizing from left edge.
            bottom: true,// Resize if pointer target matches selector
            right: true    // Resize if pointer target is the given Element
        },
        modifiers: [
            interact.modifiers.restrictSize({
                min: { width: 400, height: 400 },
                max: '#body',
            })
        ]
    })
    .on('resizemove', event => {
        let target = event.target;

        let { x, y } = target.dataset

        x = (parseFloat(target.getAttribute('data-x')) || 0);
        y = (parseFloat(target.getAttribute('data-y')) || 0);

        Object.assign(target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`
        })
    })

/**
 * Dropdown
 */
document.querySelectorAll('.dropdown-toggle').forEach(function(el) {
    el.addEventListener('click', function(e) {
        const target = e.target;
        let menu = target.querySelector('.dropdown-menu');
        if(menu.classList.contains('show')) {
            menu.classList.remove('show');
        } else {
            menu.classList.add('show');
        }
    })
})


/**
 * Program modal
 */

function openProgram(launcher) {
    let element = document.getElementById(launcher.getAttribute('data-target-id'));
    element.style.display = "block";
    putOnTop(element);
    addClass(launcher, 'open');
}

function toggleProgram(launcher) {
    let element = document.getElementById(launcher.getAttribute('data-target-id'));
    if (launcher.classList.contains('open')) {
        if (element.style.display == 'block' && element.classList.contains('ontop')) {
            document.getElementById('menu').innerHTML = '';
            hideElement(element);
        } else if (element.style.display == 'block' && !element.classList.contains('ontop')) {
            putOnTop(element);
            showElement(element);
        } else {
            putOnTop(element);
            showElement(element);
        }
    } else {
        element.style.display = "block";
        putOnTop(element);
        addClass(launcher, 'open');
    }
}

function addOptionsToProgram(element) {
    let options = element.getAttribute('data-options').split(',');
    let wrapper = document.getElementById('menu');
    wrapper.innerHTML = '';
    if(options.length > 0) {
        options.forEach(function(el) {
            let newOption = document.createElement('div');
            newOption.classList.add('li');
            newOption.innerText = el;
            wrapper.appendChild(newOption);
        });
    }
}

function removeOptions() {
    setTimeout(function() {
        document.getElementById('menu').innerHTML = '';
    }, 10);
}

function fullscreenProgram(element) {
    element.style.width = null;
    element.style.height = null;
    toggleClass(element, 'fullscreen');
    element.style.transform = 'none';
    element.setAttribute('data-x', 0);
    element.setAttribute('data-y', 0);
}

function toggleFullscreen(element) {
    if (element.classList.contains('fullscreen')) {
        removeClass(element, 'fullscreen');
        element.style.transform = 'none';
        element.setAttribute('data-x', 0);
        element.setAttribute('data-y', 0);
    } else {
        fullscreenProgram(element);
    }
}

function iconizeProgram(element) {
    element.style.display = "none";
}

function closeProgram(element, launcher) {
    element.style.display = "none";
    launcher.classList.remove('open');
    removeOptions();
}

/**
 * Program modal actions
 */
function addClass(element, classname) {
    element.classList.add(classname);
}

function removeClass(element, classname) {
    element.classList.remove(classname);
}

function toggleClass(element, classname) {
    element.classList.toggle(classname);
}

function toggleElement(element) {
    if (element.style.display == 'none')
        element.style.display = 'block';
    else
        element.style.display = 'none';
}

function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}

function getById(id) {
    return document.getElementById(id);
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, sel)));
    return el;
}

function putOnTop(element) {
    let programModals = document.getElementsByClassName("program-modal");
    Array.from(programModals).forEach(modal => removeClass(modal, 'ontop'));
    addOptionsToProgram(element);
    addClass(element, 'ontop');
}

/**
 * Context menu
 * 
 * Disable right click!
 */
if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        // alert("You've tried to open context menu"); //here you draw your own menu
        e.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function () {
        // alert("You've tried to open context menu");
        window.event.returnValue = false;
    });
}

