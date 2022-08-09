const photos = [
    { title: 'Explore', year: '2004', url: 'explore.webp' },
    { title: 'Discover', year: '2015', url: 'discover.webp' },
    { title: 'Sightseeing', year: '2007', url: 'sightseeing.webp' },
];

let i = 0, photo = photos[i];
const getPhoto = () => {
    i == 2 ? i = 0 : i++;
    photo = photos[i];
    return photo;
};

const matchMedia = window.matchMedia("(min-width: 1000px)");

const editElement = (time, callback) => {
    setTimeout(callback, time * 1000);
}

window.onload = () => {

    const layers = Array.from(document.querySelectorAll('.layer')).reverse(),
        layerValues = [0, 500, 900, 1200],
        buttonArrow = document.querySelector('.galleryButton i'),
        img = document.querySelector('.image .imageContainer'),
        titles = Array.from(document.querySelectorAll('.gallery .data .title > *')),
        data = document.querySelector('.gallery .data');

    layers.forEach((layer, i) => {

        const triggerConfig = {
            trigger: layer,
            scrub: true,
            start: 'bottom bottom',
            end: '200% top',
        }

        gsap.to(layer, { scrollTrigger: triggerConfig, duration: .1, y: layerValues[i], ease: 'none' })
    })

    gsap.to('.separator img', {
        scrollTrigger: {
            trigger: '.separator',
            scrub: true,
            start: 'top bottom',
            end: 'bottom top',
        }, duration: .1, y: '40%'
    })

    //onScroll events

    const verticalSets = {
        img: {
            go: { duration: 1, ease: 'expo.out', y: img.offsetHeight },
            back: { duration: 1, ease: 'expo.in', y: 0 },
            appear: {
                scrollTrigger: {
                    start: '80% bottom'
                }, duration: 1, y: '0', ease: 'back.in(2)'
            }
        },

        arrow: {
            go: { duration: 1, rotate: '90deg', ease: 'expo.out' },
            back: { duration: 1, rotate: '-90deg', ease: 'expo.in' },
            appear: {
                scrollTrigger: {
                    start: 'bottom bottom'
                }, duration: 1, rotate: '-90deg', ease: 'expo.in'
            }
        }
    }, horizontalSets = {
        img: {
            go: { duration: 1, ease: 'expo.out', x: img.offsetWidth },
            back: { duration: 1, ease: 'expo.in', x: 0 },
            appear: {
                scrollTrigger: {
                    start: '90% bottom'
                }, duration: 1, x: '0', ease: 'bounce.out'
            }
        },

        arrow: {
            go: { duration: 1, rotate: '0deg', ease: 'expo.out' },
            back: { duration: 1, rotate: '180deg', ease: 'expo.in' },
            appear: {
                scrollTrigger: {
                    start: 'bottom bottom'
                }, duration: 1, rotate: '180deg', ease: 'expo.in'
            }
        }
    };

    gsap.to('.image', matchMedia.matches ? horizontalSets.img.appear : verticalSets.img.appear)
    gsap.to(buttonArrow, matchMedia.matches ? horizontalSets.img.appear : verticalSets.img.appear)

    const dataObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            dataObserver.unobserve(entries[0].target);
            data.style.setProperty('--time', '1s');
            data.style.setProperty('--animation', 'unhide');


            titles.forEach((title, i) => {
                title.setAttribute("data-content", i == 0 ? photo.title : photo.year)
                title.style.setProperty('--animation', 'goUpA');
                title.innerText = title.getAttribute("data-content")

                editElement(1.01, () => {
                    title.style.color = 'white';
                })
            })
        }
    }, {
        threshold: .3
    })

    dataObserver.observe(data)


    //onClick events

    let imageState = 1;

    document.querySelector('.galleryButton').onclick = () => {

        const condition = imageState++ % 2 == 0 ? 'A' : 'B';


        //button arrow

        const arrowTl = gsap.timeline();
        arrowTl.to(buttonArrow, matchMedia.matches ? horizontalSets.arrow.go : verticalSets.arrow.go)
        arrowTl.to(buttonArrow, matchMedia.matches ? horizontalSets.arrow.back : verticalSets.arrow.back)


        //image

        getPhoto();

        const imageTl = gsap.timeline();
        imageTl.to('.image', matchMedia.matches ? horizontalSets.img.go : verticalSets.img.go)
        imageTl.to('.image', matchMedia.matches ? horizontalSets.img.back : verticalSets.img.back)

        editElement(1, () => {
            document.querySelector('.image img').src = `assets/images/gallery/${photo.url}`
        })


        //titles

        titles.forEach((title, i) => {
            title.setAttribute("data-content", i == 0 ? photo.title : photo.year)
            title.style.setProperty('--animation', `goUp${condition}`);

            const titlesTl = gsap.timeline();

            titlesTl.to(title, { duration: 1, color: '#2E358B' })
            titlesTl.to(title, { duration: 0, color: 'white' })

        })

        editElement(.9, () => {
            titles.forEach(title => {
                title.innerText = title.getAttribute("data-content");
                title.style.color = 'white';
            })
        })


        //data

        data.style.setProperty('--time', '2s');
        data.style.setProperty('--animation', `cover${condition}`);
    }

}