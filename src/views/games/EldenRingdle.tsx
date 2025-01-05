import React, { useEffect } from 'react'
import './EldenRingdle.scss'
import ArrowUpIcon from '../../icons/arrow-up';
import ArrowDownIcon from '../../icons/arrow-down';
import { AllEldenRingItems, ERItem, RatedERItem, ParticalCorrectList } from './eldenringdle/EldenRingdleData';

const EldenRingdle = () => {
    const [guess, setGuess] = React.useState('')
    const [shownItems, setShownItems] = React.useState<ERItem[]>([])
    const [guessedItems, setGuessedItems] = React.useState<RatedERItem[]>([])
    const [availableItems, setAvailableItems] = React.useState<ERItem[]>(AllEldenRingItems)
    const [correctItem, setCorrectItem] = React.useState<ERItem>(AllEldenRingItems[Math.floor(Math.random() * AllEldenRingItems.length)])

    console.log('correctItem', correctItem)

    useEffect(() => {
        if (!guess) {
            setShownItems([])
            return
        }
        const shownItems = availableItems.filter(item => item.name.toLowerCase().includes(guess.toLowerCase()))
        setShownItems(shownItems)
    }, [guess])

    const guessItem = (item: ERItem) => {
        setGuess('')
        setAvailableItems(
            ai => ai.filter(i => i.name !== item.name)
        )
        if (item.name === correctItem.name) {
            setGuessedItems(
                gi => [{ ...item, c_scaling: 'y', c_damage: 'y', c_optain: 'y', c_location: 'y' }, ...gi]
            )
        } else {
            setGuessedItems(gi => [{
                ...item,
                c_scaling: item.scaling.every(d => correctItem.scaling.includes(d)) && correctItem.scaling.every(d => item.scaling.includes(d)) ? 'y' : item.scaling.some(s => correctItem.scaling.includes(s)) ? 'p' : 'n',
                c_damage: item.damage.every(d => correctItem.damage.includes(d)) && correctItem.damage.every(d => item.damage.includes(d)) ? 'y' : item.damage.some(d => correctItem.damage.includes(d)) ? 'p' : 'n',
                c_optain: item.optain.every(o => correctItem.optain.includes(o)) ? 'y' : item.optain.some(o => correctItem.optain.includes(o)) ? 'p' : 'n',
                c_location: item.location.every(o => correctItem.location.includes(o)) ? 'y' : item.location.some(o => correctItem.location.includes(o)) ? 'p' : 'n',
            }, ...gi])
        }
    }

    const mapCorrectnessToColorStyle = (correctness: ParticalCorrectList | boolean) => {
        if (correctness == true || correctness === 'y') return { backgroundColor: '#00ff0077' }
        if (correctness === 'p') return { backgroundColor: '#ffff0077' }
        return { backgroundColor: '#ff000077' }
    }

    const getUpDownArrowFromComparison = (value: number, correctValue: number) => {
        if (value === correctValue) return null
        return value > correctValue ? <ArrowDownIcon/> : <ArrowUpIcon/>
    }

    return (
        <main className='eldenringdle'>
            <h1>Elden Ringdle</h1>
            <div className='section'>
                <h2>How to play</h2>
                <p>If something is red, your guess is wrong, if it's green, this guess is correct. Yellow means it's partially correct.</p>
            </div>
            <div className='section game'>
                <div className='search'>
                    <input type='text' value={guess} onChange={e => setGuess(e.target.value)} placeholder='Search Item...' />
                    <div className='shownitems'>
                        {shownItems.map(item => (
                            <button key={item.name} className='item' onClick={_ => guessItem(item)}>
                                <img src={item.icon} alt={item.name} />
                                <p>{item.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className='guessed'>
                    <div className='header'>
                        <span>Icon</span>
                        <span>Name</span>
                        <span>Weapon Type</span>
                        <span>Scaling</span>
                        <span>Damage Type(s)</span>
                        <span>Ash of War</span>
                        <span>Weight</span>
                        <span>Guard Boost</span>
                        <span>How to Optain</span>
                        <span>Location</span>
                    </div>
                    {guessedItems.map(item => (
                        <div key={item.name} className='item'>
                            <img src={item.icon} alt={item.name} style={mapCorrectnessToColorStyle(item.icon == correctItem.icon)}/>
                            <span style={mapCorrectnessToColorStyle(item.name == correctItem.name)}>{item.name}</span>
                            <span style={mapCorrectnessToColorStyle(item.weapon_type == correctItem.weapon_type)}>{item.weapon_type}</span>
                            <span style={mapCorrectnessToColorStyle(item.c_scaling)}>{item.scaling.join(', ')}</span>
                            <span style={mapCorrectnessToColorStyle(item.c_damage)}>{item.damage.join('/')}</span>
                            <span style={mapCorrectnessToColorStyle(item.ash_of_war == correctItem.ash_of_war)}>{item.ash_of_war}</span>
                            <span style={mapCorrectnessToColorStyle(item.weight == correctItem.weight)}>{item.weight}{getUpDownArrowFromComparison(item.weight, correctItem.weight)}</span>
                            <span style={mapCorrectnessToColorStyle(item.guard_boost == correctItem.guard_boost)}>{item.guard_boost}{getUpDownArrowFromComparison(item.guard_boost, correctItem.guard_boost)}</span>
                            <span style={mapCorrectnessToColorStyle(item.c_optain)}>{item.optain.join(', ')}</span>
                            <span style={mapCorrectnessToColorStyle(item.c_location)}>{item.location.join(', ')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default EldenRingdle
