<template>
    <div class="structure" @click="selectElement($event)" :class="{'selected': selectedElements.includes(structure.uuid)}">

        <div class="command" v-if="structure.type === 'command'" @contextmenu="rightClick($event, {context: 'element', uuid: structure.uuid})">
            <div class="content" @click.stop @blur="blur($event)" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>
            <div class="hitbox" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>



        <div class="call" v-if="structure.type === 'call'" @contextmenu="rightClick($event, {context: 'element', uuid: structure.uuid})">
            <div class="content" @click.stop @blur="blur($event)" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>
            <div class="hitbox" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>



        <div class="break" v-if="structure.type === 'break'" @contextmenu="rightClick($event, {context: 'element', uuid: structure.uuid})">
            <div class="content" @click.stop @blur="blur($event)" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>

            <svg class="break-path" preserveAspectRatio="none" viewBox="0 0 20 48">
                <polyline points="20 0 0 24 20 48"></polyline>
            </svg>

            <div class="hitbox" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>



        <div class="while" v-if="structure.type === 'while'" @contextmenu="rightClick($event, {context: 'element', uuid: structure.uuid})">
            <div class="content-container">
                <div class="content" @click.stop @blur="blur($event)" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>
            </div>

            <div class="loop-container">
                <div class="hitbox hitbox-top" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'into')"></div>
                <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
                <div class="placeholder" v-show="structure.children.length == 0"></div>
            </div>

            <div class="hitbox hitbox-bottom" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>



        <div class="do-while" v-if="structure.type === 'do-while'" @contextmenu="rightClick($event, {context: 'element', uuid: structure.uuid})">
            <div class="loop-container">
                <div class="hitbox hitbox-top" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'into')"></div>
                <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
                <div class="placeholder" v-show="structure.children.length == 0"></div>
            </div>

            <div class="content-container">
                <div class="content" @click.stop @blur="blur($event)" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>
            </div>

            <div class="hitbox hitbox-bottom" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>



        <div class="endless-loop" v-if="structure.type === 'endless-loop'" @contextmenu="rightClick($event, {context: 'element', uuid: structure.uuid})">
            <div class="content-container">
                <div class="content" @click.stop @blur="blur($event)" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>
            </div>

            <div class="loop-container">
                <div class="hitbox hitbox-top" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'into')"></div>
                <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
                <div class="placeholder" v-show="structure.children.length == 0"></div>
            </div>

            <div class="hitbox hitbox-bottom" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>



        <div class="if" ref="widthElement" v-if="structure.type === 'if'" @contextmenu="rightClick($event, {context: 'element', uuid: structure.uuid})">
            <div class="content-container" ref="heightElement">
                <div class="content" @click.stop @blur="blur($event)" @input="updatePathUI()" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>
            </div>

            <div class="condition-container" ref="conditions">
                <div class="condition-slot" v-for="(slot, i) in structure.slots" :key="i">
                    <div class="label" @click.stop @blur="blur($event, trace+'-'+i+':N')" @input="updatePathUI()" contenteditable="true" v-html="configuredSanitizeHTML(slot.content)"></div>

                    <structure v-for="(child, j) in slot.children" :key="j" :trace="trace+'-'+i+':'+j" :structure="child"></structure>
                    <div class="placeholder" v-show="slot.children.length == 0"></div>

                    <div class="hitbox hitbox-top" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'into', trace+'-'+i+':N')"></div>
                </div>
            </div>

            <svg class="condition-path" preserveAspectRatio="none" :viewBox="viewboxValues">
                <polyline :points="pathValues"></polyline>
            </svg>

            <div class="hitbox hitbox-bottom" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>



        <div class="switch" ref="widthElement" v-if="structure.type === 'switch'" @contextmenu="rightClick($event, {context: 'switch', uuid: structure.uuid})">
            <div class="content-container" ref="heightElement">
                <div class="content" @click.stop @blur="blur($event)" @input="updatePathUI()" contenteditable="true" v-html="configuredSanitizeHTML(structure.content)"></div>
            </div>

            <div class="condition-container" ref="conditions">
                <div class="condition-slot" v-for="(slot, i) in structure.slots" :key="i" @click="selectElement($event, slot.uuid)" @contextmenu="rightClick($event, {context: 'switch-slot', uuid: slot.uuid})" :class="{'selected': selectedElements.includes(slot.uuid)}">
                    <div class="label" @click.stop @blur="blur($event, trace+'-'+i+':N')" @input="updatePathUI()" contenteditable="true" v-html="configuredSanitizeHTML(slot.content)"></div>

                    <structure v-for="(child, j) in slot.children" :key="j" :trace="trace+'-'+i+':'+j" :structure="child"></structure>
                    <div class="placeholder" v-show="slot.children.length == 0"></div>

                    <div class="hitbox hitbox-top" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'into', trace+'-'+i+':N')"></div>
                </div>
            </div>

            <svg class="condition-path" preserveAspectRatio="none" :viewBox="viewboxValues">
                <polyline :points="pathValues"></polyline>
            </svg>

            <div class="hitbox hitbox-bottom" @dragstart.prevent @click.stop @mousedown="mouseDown($event, 'below')"></div>
        </div>
    </div>
</template>

<script>
    import StructureInput from '../../components/StructureInput'
    import { EventBus } from '../../../assets/js/event-bus.js'
    import { mapGetters, mapActions } from 'vuex'
    import sanitizeHTML from 'sanitize-html'

    export default {
        name: 'structure',
        props: {
            structure: {
                type: Object,
                required: true
            },
            trace: {}
        },
        data() {
            return {
                width: 0,
                height: 0,
                innerWidth: 0
            }
        },
        mounted() {
            if( ['switch', 'if'].includes(this.structure.type) )
            {
                this.updatePathUI()

            }
            // Listens to document-update
            EventBus.$on('document-update', () => {
                this.$nextTick(()=>{
                    this.updatePathUI()
                    console.log('test')
                })
            })
        },
        updated() {
            if( ['switch', 'if'].includes(this.structure.type) )
            {
                this.updatePathUI()
            }
        },
        computed: {
            ...mapGetters([
                'selectedElements',
            ]),

            viewboxValues() {
                return `0 0 ${this.width} ${this.height}`
            },

            pathValues() {
                return `0 0 ${this.width - this.innerWidth} ${this.height} ${this.width} 0`
            }
        },
        methods: {
            ...mapActions([
                'setContent',
                'selectElements',
                'setContextMenu',
                'setContextInfo',
                'setContextMenuUI',
            ]),

            mouseDown(event, position, trace = this.trace) {

                // Checks if left mouse button is down
                if( event.buttons === 1 ) EventBus.$emit('toggle-create-element', {event, trace, position})
            },

            blur(event, trace = this.trace) {

                if( !event ) return

                let content = this.configuredSanitizeHTML(event.target.innerHTML)

                this.setContent({trace, content})
            },

            selectElement(event, uuid = this.structure.uuid) {

                event.stopPropagation()
                this.selectElements({uuids: [uuid], clearPrevious: !event.ctrlKey})
            },

            rightClick(event, info = {context: null, uuid: null}) {

                event.stopPropagation()
                this.setContextMenu([event.screenX, event.screenY])
                this.setContextMenuUI(true)
                this.setContextInfo(info)
            },



            configuredSanitizeHTML(html) {

                let cleanHTML = ''

                try {
                    cleanHTML = sanitizeHTML(html, {
                        allowedTags: [ 'br' ],
                        disallowedTagsMode: 'escape'
                    })
                } catch (error) {
                    console.error("Couldn't sanitize HTML. Fallback to empty string. Error below:")
                    console.error(error)
                }

                return cleanHTML
            },

            updatePathUI() {

                // For christs sake; I dont even care
                try
                {
                    this.width = this.$refs.widthElement.offsetWidth
                    this.height = this.$refs.heightElement.offsetHeight + this.$refs.conditions.lastChild.getElementsByClassName('label')[0].offsetHeight
                    this.innerWidth = this.$refs.conditions.lastChild.offsetWidth
                }
                catch (error) {}
            },
        },
        components: {
            StructureInput,
        }
    }
</script>

<style lang="sass">
    .placeholder
        background-image: url('~@/assets/images/interface/line.svg')
        background-size: 20px
        background-position: top center
        height: 50px
        width: 100%
        min-width: 50px
        border: 1px solid black
        margin-bottom: -1px

        &.rendered
            background-image: none

    .hitbox
        background: #2d98da77
        border-radius: 5px
        width: 0
        height: 30px
        position: absolute
        bottom: -15px
        left: 0
        z-index: 10
        opacity: 0
        cursor: pointer
        display: block

        &:hover
            opacity: 1

        &.first
            height: 30px
            left: 15px
            top: 0
            width: calc(100% - 30px)

    .structure
        display: block
        text-align: left
        position: relative
        margin-bottom: -1px

        &.selected
            .command,
            .call,
            .break,
            .while,
            .do-while,
            .endless-loop,
            .if,
            .switch,
                background: #77E3C7

        .command
            width: 100%
            background: white
            color: black
            padding: 12px 10px
            min-width: 200px
            text-align: center
            border: 1px solid black
            position: relative

            .hitbox
                width: 100%

        .call
            width: 100%
            background: white
            color: black
            padding: 12px 25px
            min-width: 200px
            text-align: center
            border: 1px solid black
            position: relative

            &::before
                content: ''
                position: absolute
                left: 18px
                top: -1px
                height: calc(100% + 2px)
                border-right: 1px solid black

            &::after
                content: ''
                position: absolute
                right: 18px
                top: -1px
                height: calc(100% + 2px)
                border-left: 1px solid black

            .hitbox
                width: 100%

        .break
            width: 100%
            background: white
            color: black
            padding: 12px 25px
            min-width: 200px
            text-align: center
            border: 1px solid black
            position: relative

            .break-path
                height: calc(100% + 0px)
                width: 19px
                position: absolute
                top: -0px
                left: -0.8px
                stroke: #000
                stroke-width: 0.7px
                fill: none

            .hitbox
                width: 100%

        .while
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                padding: 12px 10px
                min-width: 200px
                width: 100%
                text-align: center

            > .loop-container
                display: block
                min-height: 50px
                margin-left: 17px
                position: relative
                margin-top: -1px
                bottom: -1px
                right: -1px
                padding-bottom: 1px

                > .hitbox-top
                    top: -15px
                    width: 100%

            > .hitbox-bottom
                width: 18px
        
        .do-while
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                padding: 12px 10px
                min-width: 200px
                width: 100%
                text-align: center
                margin-top: -1px // Somehow margin-bottom -1px doesnt work on loop-contianer

            > .loop-container
                display: block
                min-height: 50px
                margin-left: 17px
                position: relative
                top: -1px
                right: -1px
                padding-bottom: 1px

                > .hitbox-top
                    top: 0px
                    width: 100%
                    height: 20px

            > .hitbox-bottom
                width: 100%

        .endless-loop
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative
            padding-bottom: 48px

            > .content-container
                padding: 12px 10px
                min-width: 200px
                width: 100%
                text-align: center

            > .loop-container
                min-height: 50px
                display: block
                margin-left: 17px
                position: relative
                right: -1px
                padding-bottom: 1px

                > .hitbox-top
                    top: -15px
                    width: 100%

            > .hitbox-bottom
                width: 100%

        .if
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                min-height: 25px
                padding: 0px 10px
                min-width: 200px
                width: 100%
                text-align: center
                position: relative
                z-index: 1

            > .condition-path
                width: 100%
                position: absolute
                top: 0px
                left: 0
                stroke: #000
                stroke-width: 0.8px
                fill: none
                pointer-events: none

                polyline
                    fill: transparent

            > .condition-container
                display: flex
                min-height: 50px
                width: calc(100% + 2px)
                margin: -1px

                .condition-slot
                    flex: 1
                    position: relative
                    padding-bottom: 1px

                    // This prevents the child structure to be vertically oversized
                    // And dont ask me why it is oversized
                    > .structure
                        display: inline-block
                        width: 100%

                    > .hitbox-top
                        top: 24px
                        height: 20px
                        width: 100%

                    .label
                        line-height: 20px
                        font-size: 14px
                        color: black
                        float: left
                        cursor: text
                        padding: 2px 4px
                        border-radius: 3px
                        position: relative
                        z-index: 1

                        &:hover
                            background: #1dd1a199

                    &:last-of-type > .label
                        float: right

                    &:not(:last-of-type)
                        margin-right: -1px

            > .hitbox-bottom
                width: 100%
                height: 20px
                bottom: -20px

            > .hitbox-bottom
                width: 100%
                height: 20px
                bottom: -20px

        .switch
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                min-height: 25px
                padding: 0px 10px
                min-width: 200px
                width: 100%
                text-align: center
                position: relative
                z-index: 1

            > .condition-path
                height: 47px
                width: 100%
                position: absolute
                top: 0
                left: 0
                stroke: #000
                stroke-width: 0.8px
                fill: none
                pointer-events: none

                polyline
                    fill: transparent

            > .condition-container
                display: flex
                min-height: 50px
                width: calc(100% + 2px)
                margin: -1px
                position: relative

                .condition-slot
                    flex: 1
                    position: relative
                    padding-bottom: 1px
                    border-radius: 3px 3px 0 0

                    &.selected
                        background: #77E3C7

                        .command,
                        .call,
                        .break,
                        .while,
                        .do-while,
                        .endless-loop,
                        .if,
                        .switch,
                            background: #77E3C7

                    // This prevents the child structure to be vertically oversized
                    // And dont ask me why it is oversized
                    > .structure
                        display: inline-block
                        width: 100%

                    > .hitbox-top
                        top: 24px
                        height: 20px
                        width: 100%

                    .label
                        line-height: 20px
                        font-size: 14px
                        color: black
                        float: left
                        cursor: text
                        padding: 2px 4px
                        border-radius: 3px
                        position: relative
                        z-index: 1

                        &:hover
                            background: #1dd1a199

                    &:last-of-type > .label
                        float: right

                    &:not(:last-of-type)
                        margin-right: -1px

            > .hitbox-bottom
                width: 100%
                height: 20px
                bottom: -20px

        .command,
        .call,
        .break,
        .while,
        .do-while,
        .endless-loop,
        .switch,
        .if
            .content
                font-size: 15px
                line-height: 20px
                text-align: center
                cursor: text
                padding: 2px 4px
                border-radius: 3px

                &:hover
                    background: #1dd1a199
</style>