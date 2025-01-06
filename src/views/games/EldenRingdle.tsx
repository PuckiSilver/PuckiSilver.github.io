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
                c_scaling: checkCorrectnessForList(item.scaling, correctItem.scaling),
                c_damage: checkCorrectnessForList(item.damage, correctItem.damage),
                c_optain: checkCorrectnessForList(item.optain, correctItem.optain),
                c_location: checkCorrectnessForList(item.location, correctItem.location),
            }, ...gi])
        }
    }

    const checkCorrectnessForList = (list: string[], correctList: string[]): ParticalCorrectList => {
        if (list.every(d => correctList.includes(d)) && correctList.every(d => list.includes(d))) return 'y'
        if (list.some(d => correctList.includes(d))) return 'p'
        return 'n'
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
                        <span>Damage Type</span>
                        <span>Ash of War</span>
                        <span>Weight</span>
                        <span>Guard Boost</span>
                        <span>How to Optain</span>
                        <span>Location</span>
                    </div>
                    {guessedItems.map(item => (
                        <div key={item.name} className='item'>
                            <div className='cell'>
                                <img src={item.icon} alt={item.name}/>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.name == correctItem.name)}>
                                <span>{item.name}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.weapon_type == correctItem.weapon_type)}>
                                <span>{item.weapon_type}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.c_scaling)}>
                                <span>{item.scaling.join(', ')}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.c_damage)}>
                                <span>{item.damage.join('/')}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.ash_of_war == correctItem.ash_of_war)}>
                                <span>{item.ash_of_war}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.weight == correctItem.weight)}>
                                {getUpDownArrowFromComparison(item.weight, correctItem.weight)}
                                <span>{item.weight}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.guard_boost == correctItem.guard_boost)}>
                                {getUpDownArrowFromComparison(item.guard_boost, correctItem.guard_boost)}
                                <span>{item.guard_boost}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.c_optain)}>
                                <span>{item.optain.join(', ')}</span>
                            </div>
                            <div className='cell' style={mapCorrectnessToColorStyle(item.c_location)}>
                                <span>{item.location.join(', ')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default EldenRingdle
