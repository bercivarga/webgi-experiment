import './style.scss'

import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('canvas'),
        useRgbm: false,
        isAntialiased: false,

    });

    const camera = viewer.scene.activeCamera;
    camera.controls.enabled = false;
    viewer.scene.activeCamera = viewer.createCamera(camera.cameraObject);

    // camera.positionTargetUpdated(true);

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)

    // Add a popup(in HTML) with download progress when any asset is downloading.
    // await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    // await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    // await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    await manager.addFromPath("chair-scene.glb")

    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

    // Add some UI for tweak and testing.
    // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    // uiPlugin.setupPlugins(TonemapPlugin, CanvasSnipperPlugin)

    // WEBGI UPDATE
    let needsUpdate = true;

    function updateCamera() {
        needsUpdate = true;
        viewer.renderer.resetShadows();
        viewer.setDirty();
    }

    camera.position.set(1.9779411899, 2.5707351077, 8.785740889);
    camera.target.set(-1.1638817739, 0.2612881536, 1.6199592641);

    updateCamera();

    viewer.addEventListener('preFrame', () => {
        if (needsUpdate) {
            camera.positionTargetUpdated(true);
            needsUpdate = false;
        }
    });

    const firstStripe = document.querySelector('.first-stripe');
    const secondStripe = document.querySelector('.second-stripe');

    (function setupScrollAnim() {
        const tl = gsap.timeline();

        // First section
        tl.to(camera.position, {
            scrollTrigger: {
                trigger: ".page-section__second",
                scrub: 1,
                start: "top bottom",
                end: "top top",
                immediateRender: false,
            },
            x: -2.478943811,
            y: 1.4730810966,
            z: 3.977213525,
            duration: 2,
            onUpdate: updateCamera,
        })
            .to(camera.target, {
                scrollTrigger: {
                    trigger: ".page-section__second",
                    scrub: 1,
                    start: "top bottom",
                    end: "top top",
                    immediateRender: false,
                },
                x: 0.7684664935,
                y: 0.3398988927,
                z: -0.1319013202,
                duration: 2,
                // onUpdate: updateCamera,
            })
            .to(firstStripe, {
                scrollTrigger: {
                    trigger: ".page-section__second",
                    scrub: 1,
                    start: "top bottom",
                    end: "top top",
                    immediateRender: false,
                },
                clipPath: 'inset(50% 0 25% 50%)',
                duration: 2,
                onUpdate: updateCamera,
            })
            .to(secondStripe, {
                scrollTrigger: {
                    trigger: ".page-section__second",
                    scrub: 1,
                    start: "top bottom",
                    end: "top top",
                    immediateRender: false,
                },
                clipPath: 'inset(0 60% 0 40%)',
                duration: 2,
                onUpdate: updateCamera,
            })

            // Third section
            .to(camera.position, {
                scrollTrigger: {
                    trigger: ".page-section__third",
                    scrub: 1,
                    start: "top bottom",
                    end: "top top",
                    immediateRender: false,

                },
                x: 0.14525348191734644,
                y: 0.2546533080975514,
                z: -5.041940141013417,
                duration: 2,
                onUpdate: updateCamera,
            })
            .to(camera.target, {
                scrollTrigger: {
                    trigger: ".page-section__third",
                    scrub: 1,
                    start: "top bottom",
                    end: "top top",
                    immediateRender: false,
                },
                x: 0.8036156172,
                y: 0.5979497955,
                z: -0.1227485527,
                duration: 2,
                // onUpdate: updateCamera,
            })

    })();

    return viewer;
}

setupViewer().then((viewer) => {
    viewer.scene.activeCamera.controls.enabled = false
});