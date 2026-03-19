import { Scene } from 'phaser';
import guestDataManager from '../GuestData';
import { EventBus } from '../EventBus';
import { AUDIO_TRACKS, MENU_LOGO_PATH } from '../assets';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
        this.questionsLoaded = false;
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(centerX, centerY, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(centerX - 230, centerY, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game
        this.desertAssetsLoaded = true;
        this.load.setPath('assets');

        // Load menu logo
        this.load.image('logo', MENU_LOGO_PATH);

        // Load Tuxemon tileset and tilemaps (using extruded version to prevent texture bleeding)
        this.load.image('tiles', 'tuxmon-sample-32px-extruded.png');
        this.load.tilemapTiledJSON('map', 'tuxemon-town.json');
        this.load.tilemapTiledJSON('large-map', 'pokelenny-large-map.json');

        // Load character sprites - all angles
        this.load.image('main-front', 'main-front.png');
        this.load.image('main-back', 'main-back.png');
        this.load.image('main-left', 'main-left.png');
        this.load.image('main-right', 'main-right.png');
        this.load.image('elena-front', 'elena-front.webp');

        // Load the two tracks needed for the first session; the rest are lazy-loaded on demand.
        this.load.audio(AUDIO_TRACKS.menu.key, AUDIO_TRACKS.menu.path);
        this.load.audio(AUDIO_TRACKS.overworld.key, AUDIO_TRACKS.overworld.path);

        // Load questions.json
        this.load.json('questions', 'questions.json');

        // Additional maps - load locally when available
        // World 2 (Desert) - alternates with World 1 (Tuxemon)
        this.load.image('desert-tiles', 'tilemaps/tmw_desert_spacing.png');
        this.load.tilemapTiledJSON('desert-map', 'tilemaps/desert.json');

        this.load.on('loaderror', (file) => {
            if (file?.key === 'desert-map' || file?.key === 'desert-tiles') {
                this.desertAssetsLoaded = false;
            }
        });

        // Set up callback for when questions.json loads
        this.load.once('complete', () => {
            const desertReady = this.desertAssetsLoaded
                && this.cache.tilemap.exists('desert-map')
                && this.textures.exists('desert-tiles');
            this.registry.set('desertAssetsLoaded', desertReady);

            this.loadGuestData();
        });
    }

    loadGuestData ()
    {
        if (this.questionsLoaded) return;
        this.questionsLoaded = true;

        console.log('Loading guest data...');

        // Get questions data from cache
        const questionsData = this.cache.json.get('questions');

        if (!questionsData) {
            console.error('Failed to load questions.json');
            return;
        }

        console.log('Questions data loaded:', questionsData.episodes ? questionsData.episodes.length : 0, 'episodes');

        // Process questions and select ALL guests for fixed stage system
        guestDataManager.loadQuestionsData(questionsData);
        guestDataManager.selectAllGuestsForFixedStages(); // Load stage-config guests only

        // Avatar textures are now loaded per stage in the overworld.
        EventBus.emit('guests-loaded', guestDataManager.getSelectedGuests());
        this.scene.start('MainMenu');
    }

    create ()
    {
        // This will only be called if no avatars need to be loaded
        // Otherwise loadGuestData handles the scene transition
        if (!this.questionsLoaded) {
            console.log('Preloader create called without guest data');
            this.scene.start('MainMenu');
        }
    }
}
