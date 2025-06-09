import React from 'react';
import './ficha.css';

const Ficha = ({ icon, name, hourStart, hourEnd, available, price }) => {
    return (
        <div className='card-container' 
        style={{ backgroundColor: available ? 'var(--primary)' : 'var(--medium)', color: available ? 'var(--dark)' : 'var(--light)' }}>
            <div className='icon'>{icon}</div>
            <div>
                <h2>{name}</h2>
                <p><b>Horário: </b>{hourStart}:00 às {hourEnd}:00</p>
            </div>
            <h3 className='price'>R$ {parseFloat(price).toFixed(2)}</h3>
        </div>
    )
}

export default Ficha;