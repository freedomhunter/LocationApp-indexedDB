import React from 'react';

export default function Nodata() {
    return (
        <div className="d-flex justify-content-center h-80">
        <div className="align-self-center">
            <div className="d-flex justify-content-center">
                <img className="imgLocation w-70" src="/assets/img/icon.svg" alt="location" />
            </div>
            <h3 className="mt-3 mb-2 lead">Kindly Add Your Location First</h3>
            <p className="fs-dot9 text-center fade-color">There's no location added right now</p>
        </div>
        </div>
    )
}