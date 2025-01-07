import React, { useEffect } from 'react'
import './EldenRingdle.scss'
import ArrowUpIcon from '../../icons/arrow-up';
import ArrowDownIcon from '../../icons/arrow-down';
import { allEldenRingItems, ERItem } from './eldenringdle/EldenRingdleData';

const getRandomNumberWithSeed = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % allEldenRingItems.length;
}

const getTodaysSeed = (): string => {
    const date = new Date()
    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}-EldenRingdlePuckiSilver1337`
}

const getYesterdaysSeed = (): string => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}-EldenRingdlePuckiSilver1337`
}

const getTimeUntilNextDay = (): Date => {
    const tomorrow = new Date()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)
    const now = new Date()
    return new Date(tomorrow.getTime() - now.getTime())
}

const getColor = (correctness: boolean): object => {
    return correctness ? { backgroundColor: '#00ff0077' } : { backgroundColor: '#ff000077' }
}

const compareListGetColor = (list: string[], correctList: string[]): object => {
    if (list.every(d => correctList.includes(d)) && correctList.every(d => list.includes(d))) return getColor(true)
    if (list.some(d => correctList.includes(d))) return { backgroundColor: '#ffff0077' }
    return getColor(false)
}

const getUpDownArrowFromComparison = (value: number, correctValue: number) => {
    if (value === correctValue) return null
    return value > correctValue ? <ArrowDownIcon/> : <ArrowUpIcon/>
}

const getFormattedTimeLeft = (date: Date): string => {
    const hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()
    const minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()
    const seconds = date.getUTCSeconds() < 10 ? `0${date.getUTCSeconds()}` : date.getUTCSeconds()
    return `${hours}:${minutes}:${seconds}`
}

const EldenRingdle = () => {
    const [guess, setGuess] = React.useState('')
    const [shownItems, setShownItems] = React.useState<ERItem[]>([])
    const [activeSeed, setActiveSeed] = React.useState(getTodaysSeed())
    const [guessedItemIds, setGuessedItemIds] = React.useState<number[]>(localStorage.getItem(`eldenringdle-guessed-${activeSeed}`)?.split(',').map(Number) || [])
    const [availableItems, setAvailableItems] = React.useState<ERItem[]>(allEldenRingItems.filter(item => !guessedItemIds.includes(item.id)))
    const [correctItem, setCorrectItem] = React.useState<ERItem>(allEldenRingItems[getRandomNumberWithSeed(activeSeed)])
    const [dateUntilNextItem, setDateUntilNextItem] = React.useState<Date>(getTimeUntilNextDay())

    useEffect(() => {
        const interval = setInterval(() => {
            setDateUntilNextItem(date => new Date(date.getTime() - 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!guess) {
            setShownItems([])
            return
        }
        const shownItems = availableItems.filter(item => item.name.toLowerCase().includes(guess.toLowerCase()))
        setShownItems(shownItems)
    }, [guess, availableItems])

    const guessItem = (item: ERItem) => {
        setGuess('')
        setAvailableItems(ai => ai.filter(i => i.id !== item.id))
        localStorage.setItem(`eldenringdle-guessed-${activeSeed}`, [item.id, ...guessedItemIds].join(','))
        setGuessedItemIds(gii => [item.id, ...gii])
    }

    return (
        <main className='eldenringdle'>
            <h1>Elden Ringdle</h1>
            <div className='section'>
                <h2>How to play</h2>
                <p>Type the name of any Elden Ring weapon in the search bar and select one. Your guess will be scored on how close it is to the correct one.</p>
                <p>If a cell is red, that value is wrong, if it's green, the value is correct. Yellow means it's partially correct. An up arrow means, the actual value is higher, a down arrow means it's lower.</p>
                <p>Currently not all weapons are featured yet, the next ones will be added soon.</p>
            </div>
            <div className='section game'>
                {!guessedItemIds.includes(correctItem.id) ? <div className='search'>
                    <input type='text' value={guess} onChange={e => setGuess(e.target.value)} placeholder='Search Item...' />
                    <div className='shownitems'>
                        {shownItems.map(item => (
                            <button key={item.name} className='item' onClick={_ => guessItem(item)}>
                                <img src={item.icon} />
                                <p>{item.name}</p>
                            </button>
                        ))}
                    </div>
                </div> :
                <div className='correct'>
                    <h1>You Won!</h1>
                    <div className='item'>
                        <img src={correctItem.icon} />
                        <p>You correctly guessed<br/><b>{correctItem.name}</b></p>
                    </div>
                    <p>Next item in {getFormattedTimeLeft(dateUntilNextItem)}</p>
                </div>}
                <div className='guessed'>
                    <div className='header'>
                        <span>Icon</span>
                        <span>Name</span>
                        <span>Weapon Type</span>
                        <span>Scaling</span>
                        <span>Damage Type</span>
                        <span>Ash of War</span>
                        <span>Weight</span>
                        <span>Guard Boost</span>
                        <span>How to Optain</span>
                        <span>Location</span>
                    </div>
                        {guessedItemIds.map(itemId => {
                            const item = allEldenRingItems[itemId]
                            return (
                            <div key={item.name} className='item'>
                                <div className='cell'>
                                    <img src={item.icon} alt={item.name}/>
                                </div>
                                <div className='cell' style={getColor(item.name === correctItem.name)}>
                                    <span>{item.name}</span>
                                </div>
                                <div className='cell' style={getColor(item.weapon_type === correctItem.weapon_type)}>
                                    <span>{item.weapon_type}</span>
                                </div>
                                <div className='cell' style={compareListGetColor(item.scaling, correctItem.scaling)}>
                                    <span>{item.scaling?.length ? item.scaling.join(', ') : '-'}</span>
                                </div>
                                <div className='cell' style={compareListGetColor(item.damage, correctItem.damage)}>
                                    <span>{item.damage.join('/')}</span>
                                </div>
                                <div className='cell' style={getColor(item.ash_of_war === correctItem.ash_of_war)}>
                                    <span>{item.ash_of_war}</span>
                                </div>
                                <div className='cell' style={getColor(item.weight === correctItem.weight)}>
                                    {getUpDownArrowFromComparison(item.weight, correctItem.weight)}
                                    <span>{item.weight}</span>
                                </div>
                                <div className='cell' style={getColor(item.guard_boost === correctItem.guard_boost)}>
                                    {getUpDownArrowFromComparison(item.guard_boost, correctItem.guard_boost)}
                                    <span>{item.guard_boost}</span>
                                </div>
                                <div className='cell' style={compareListGetColor(item.optain, correctItem.optain)}>
                                    <span>{item.optain.join(', ')}</span>
                                </div>
                                <div className='cell' style={compareListGetColor(item.location, correctItem.location)}>
                                    <span>{item.location.join(', ')}</span>
                                </div>
                            </div>
                        )}
                    )}
                </div>
                <div className='footer'>
                    <span>Yesterday's item was: </span>
                    <img src={allEldenRingItems[getRandomNumberWithSeed(getYesterdaysSeed())].icon} />
                    <span>{allEldenRingItems[getRandomNumberWithSeed(getYesterdaysSeed())].name}</span>
                </div>
            </div>
            <span className='disclaimer'>
                This is a fan made game and not affiliated with FromSoftware or Bandai Namco.
                If you have any suggestions or found a bug, please <a href='/contact'>contact me</a>.
            </span>
        </main>
    )
}

export default EldenRingdle
