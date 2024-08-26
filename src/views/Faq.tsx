import React from 'react'

export default function Links() {
    return (
        <main className='faq'>
            <h1>Frequently Asked Questions</h1>
            <div className='section'>
                <h2>Does the pack work on <u>PaperMC</u>?</h2>
                <p><b>No</b>, PaperMC really aggressively disables features that Data Packs rely on and trying to make the pack work with Paper would really limit what I could do.</p>
            </div>
            <div className='section'>
                <h2>Does the pack work with other <u>Data Packs</u>?</h2>
                <p>Generally <b>yes</b>, though you might need to combine them using something like <a href='https://weld.smithed.dev/'>weld</a> to get the models and textures working properly.</p>
            </div>
            <div className='section'>
                <h2>Does the pack work with other <u>Mods</u>?</h2>
                <p>Generally <b>yes</b>, though mods can introduce unexpected things that I can't account for. Also some packs might be limited to work with vanilla items, blocks and entities.</p>
            </div>
            <div className='section'>
                <h2>I have found a <u>bug</u>, is it known already?</h2>
                <p>Make sure to quickly check the open <u>and closed</u> <b>issues on GitHub</b> and check the <b>comments on PlanetMinecraft</b> of the page corresponding to the pack. If the bug hasn't been addressed in either of these, please <b>create an issue or comment</b>.</p>
            </div>
            <div className='section'>
                <h2>How can I <u>contact</u> you?</h2>
                <p>It's best to create an <b>issue on GitHub</b> or leave a <b>comment on PlanetMinecraft</b> of the page corresponding to the pack. If you need to reach me directly, feel free to add <code>puckisilver</code> <b>on Discord</b>.</p>
            </div>
        </main>
    )
}
