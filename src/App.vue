<template>
    <div id="app">
        <header class="titlebar">
            <div class="drag-area">
                <div class="window-title">
                    <div class="tab-container">
                        <div class="tab" :key="i" v-for="(tab, i) in tabHandles" :class="{'active' : tab.UUID === activeUUID}">
                            <div class="change-dot" :class="{'active' : tab.changed}"></div>
                            <div class="title" :title="tab.name" @click="selectTab(tab.UUID)">{{tab.name}}</div>
                            <div class="close" @click="deleteTab(tab.UUID)">&#983382;</div>
                        </div>
                        <div class="create" @click="addTab({selectOnCreation: true})">&#984085;</div>
                    </div>
                </div>
                <div class="window-controls">
                    <div class="tb-button" id="min-button">
                        <div class="icon">&#983924;</div>
                    </div>
                    <div class="tb-button" id="max-button">
                        <div class="icon">&#983345;</div>
                    </div>
                    <div class="tb-button" id="restore-button">
                        <div class="icon">&#983351;</div>
                    </div>
                    <div class="tb-button" id="close-button">
                        <div class="icon">&#983382;</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Preloader -->
        <div id="preloader" :class="{'loaded': !preloaderUI}">
            <div class="logo"></div>
            <spinner class="spinner" color="white" stroke="4"></spinner>
        </div>

        <view-layout-creator></view-layout-creator>

        <!-- Overlays / Popups -->
        <settings v-show="settingsUI"></settings>
        <export v-show="exportUI"></export>
        <release-notes v-show="releaseNoteUI"></release-notes>
    </div>
</template>

<style lang="sass">
    @import '@/assets/sass/app.sass'
</style>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import Settings from './views/settings/Settings.vue'
    import Export from './views/dialogs/Export.vue'
    import ReleaseNotes from './views/dialogs/ReleaseNotes.vue'
    import Spinner from './views/components/Spinner.vue'

    import ViewLayoutCreator from './views/layout-creator/LayoutCreator.vue'

    export default {
        computed: {
            ...mapGetters([
                'tabHandles',
                'activeUUID',
                'releaseNoteUI',
                'preloaderUI',
                'settingsUI',
                'exportUI',
            ]),
        },
        methods: {
            ...mapActions([
                'addTab',
                'selectTab',
                'deleteTab',
            ]),
        },
        components: {
            Settings,
            Export,
            ReleaseNotes,
            Spinner,

            // Views
            ViewLayoutCreator,
        },
        mounted() {
        },
    }
</script>
