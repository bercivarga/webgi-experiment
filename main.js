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

    const camPos = camera.position;
    const camTarget = camera.target;

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
        // viewer.renderer.resetShadows()
        viewer.setDirty()
    }

    viewer.addEventListener('preFrame', () =>{
        if(needsUpdate){
            camera.positionTargetUpdated(true)
            needsUpdate = false
        }
    })

    function setupScrollAnim() {
        const tl = gsap.timeline();
        tl.to(camPos, {
            scrollTrigger: {
                trigger: ".page-section__second",
                scrub: true,
                start: "top top",
                end: "bottom top",
                markers: true,
            },
            y: 2,
            x: 2,
            z: 2,
            duration: 5,
            ease: "power2.inOut",
            onUpdate: updateCamera,
        })
            .to(camPos, {
                scrollTrigger: {
                    trigger: ".page-section__third",
                    scrub: true,
                    start: "top top",
                    end: "bottom top",
                    markers: true,
                },
                y: 4,
                x: 4,
                duration: 5,
                ease: "power2.inOut",
                onUpdate: updateCamera,
            })
            .to(camPos, {
                scrollTrigger: {
                    trigger: ".page-section__first",
                    scrub: true,
                    start: "top top",
                    end: "bottom top",
                    markers: true,
                },
                y: 0,
                x: 0,
                duration: 5,
                ease: "power2.inOut",
                onUpdate: updateCamera,
            });

    }

    setupScrollAnim(camera, updateCamera);

    return viewer;
}

setupViewer().then((viewer) => {
    viewer.scene.activeCamera.controls.enabled = false
});