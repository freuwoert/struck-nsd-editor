<template>
    <div class="release-note-bg" :class="{'active' : show}">
        <div class="release-note-holder">
            <div class="release-image">
                <span class="title">{{version}}</span>
                <div class="logo"></div>
            </div>
            <span class="headline">Willkommen in Struck!</span>
            <div class="release-note-container">
                In dieser Version von <b>Struck</b> kannst du nun auch:<br>
                » Elemente hinzufügen und löschen<br>
                » Dateien speichern<br>
                » Dateien als PNG oder JPG exportieren<br>
            </div>
            <div class="close-release-note" @click="$emit('close')">Auf gehts!</div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['show', 'version'],
    }
</script>
<style lang="sass" scoped>
    .release-note-bg
        width: 100%
        height: 100%
        position: absolute
        left: 0
        top: 0
        z-index: 10000
        background: rgba(0,0,0,0)
        pointer-events: none
        transition: background 400ms ease-in-out
        transition: all 300ms ease-in-out

        &.active
            pointer-events: all
            background: rgba(0,0,0,0.7)

        .release-note-holder
            width: calc(100% - 40px)
            max-width: 500px
            position: fixed
            top: 50%
            left: 50%
            border-radius: 20px
            font-size: 0
            background: #ffffff
            transform: translate(-50%, -50%)
            transition: all 300ms ease-in-out

            .release-image
                height: 220px
                width: 100%
                margin-bottom: 70px
                border-radius: 20px  20px 0 0
                background-image: url('~@/assets/images/interface/update_sprout.jpg')
                background-repeat: no-repeat
                background-position: center
                background-size: cover
                position: relative
                user-select: none

                .title
                    color: white
                    font-weight: 600
                    line-height: 90px
                    position: absolute
                    top: 50%
                    left: 10px
                    transform: translateY(-50%)
                    font-size: 40px
                    width: calc(100% - 20px)
                    text-align: center
                    background: #00000030
                    backdrop-filter: blur(20px)
                    border-radius: 15px
                    z-index: 1
            
            .headline
                color: black
                font-weight: 700
                line-height: 40px
                font-size: 25px
                width: 100%
                text-align: center

            .release-note-container
                width: calc(100% - 40px)
                margin: 20px 40px 60px
                text-align: left
                color: #333
                font-size: 15px
                line-height: 27px
                overflow-y: auto

            .close-release-note
                height: 40px
                line-height: 40px
                border-radius: 5px
                text-align: center
                color: white
                background: var(--primary)
                width: 200px
                font-size: 16px
                display: block
                margin: 20px auto
                cursor: pointer
                user-select: none
                transition: all 50ms

                &:hover
                    background: var(--accent)
</style>