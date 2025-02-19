import React from 'react'
import { communityLinks, platformLinks, resourcesLinks } from '../constants'

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-neutral-700 ">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <h3 className="text-md font-semibold mb-4">
                        Resources
                    </h3>
                    <ul className="space-y-2">
                        {resourcesLinks.map((link, index) => (
                            <li key={index}>
                                <a 
                                className="text-neutral-200 hover:text-blue-700"
                                href={link.href}> {link.text} </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-md font-semibold mb-4">
                        Platforms
                    </h3>
                    <ul className="space-y-2">
                        {platformLinks.map((link, index) => (
                            <li key={index}>
                                <a 
                                className="text-neutral-200 hover:text-blue-700"
                                href={link.href}> {link.text} </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-md font-semibold mb-4">
                        Community
                    </h3>
                    <ul className="space-y-2">
                        {communityLinks.map((link, index) => (
                            <li key={index}>
                                <a 
                                className="text-neutral-200 hover:text-blue-700"
                                href={link.href}> {link.text} </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </footer>
    )
}

export default Footer