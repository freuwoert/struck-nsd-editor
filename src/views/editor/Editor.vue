<template>
    <div class="view">
        <option-panel></option-panel>
        <workspace-panel></workspace-panel>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import OptionPanel from './components/OptionPanel'
    import WorkspacePanel from './components/WorkspacePanel'

    export default {
        computed: {
            ...mapGetters([]),
        },
        methods: {
            ...mapActions([]),
        },
        components: {
            WorkspacePanel,
            OptionPanel,
        }
    }
</script>
<style lang="sass" scoped>
    .view
        background: var(--dark-background)
        display: grid
        grid-template-columns: 100%
        grid-template-rows: 40px auto
        grid-template-areas: "option_panel" "workspace"
</style>