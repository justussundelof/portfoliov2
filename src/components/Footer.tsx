const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container-studio py-16">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* <div className="lg:col-span-6">
                        <h2 className="text-title font-serif mb-6">Studio</h2>
                        <p className="text-body max-w-md opacity-80 leading-relaxed">
                            A creative studio dedicated to crafting exceptional digital experiences
                            through thoughtful design and innovative technology.
                        </p>
                    </div> */}

                    <div className="lg:col-span-6 grid sm:grid-cols-3 gap-8">
                        {/* <div>
                            <h3 className="text-subtitle mb-4 opacity-60">Work</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="nav-link opacity-80 hover:opacity-100">Projects</a></li>
                                <li><a href="#" className="nav-link opacity-80 hover:opacity-100">Case Studies</a></li>
                                <li><a href="#" className="nav-link opacity-80 hover:opacity-100">Client List</a></li>
                            </ul>
                        </div> */}

                        {/*   <div>
                            <h3 className="text-subtitle mb-4 opacity-60">Studio</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="nav-link opacity-80 hover:opacity-100">About</a></li>
                                <li><a href="#" className="nav-link opacity-80 hover:opacity-100">Team</a></li>
                                <li><a href="#" className="nav-link opacity-80 hover:opacity-100">Careers</a></li>
                            </ul>
                        </div> */}

                        <div>
                            {/* <h3 className="text-subtitle mb-4 opacity-60">Socials</h3> */}
                            {/* <ul className="space-y-2">
                                <li><a href="https://www.instagram.com/justussundelof/" className="nav-link opacity-80 hover:opacity-100">Instagram</a></li>
                                <li><a href="https://linkedin.com/in/justus-sundelöf-62a97020b" className="nav-link opacity-80 hover:opacity-100">LinkedIn</a></li>
                                <li><a href="https://github.com/justussundelof" className="nav-link opacity-80 hover:opacity-100">GitHub</a></li>
                            </ul> */}
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-primary-foreground/10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-caption opacity-60">
                            © {currentYear} Justus Sundelöf
                        </p>
                        <div className="flex space-x-6">
                            <a href="https://www.instagram.com/justussundelof/" className="nav-link opacity-80 hover:opacity-100">Instagram</a>
                            <a href="https://linkedin.com/in/justus-sundelöf-62a97020b" className="nav-link opacity-80 hover:opacity-100">LinkedIn</a>
                            <a href="https://github.com/justussundelof" className="nav-link opacity-80 hover:opacity-100">GitHub</a>



                            {/* <a href="#" className="text-caption opacity-60 hover:opacity-100 transition-opacity">
                                Terms of Service
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;