import React, { useState } from 'react'; // Importe o useState
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { motion } from 'framer-motion';
import JanainaPhoto from './Assets/Janaina.jpg';
import DouglasPhoto from './Assets/Douglas.jpg';
import AyamePhoto from './Assets/Ayame.jpg';
import linkedinImage from './Assets/Linkedin.png';
import instagramImage from './Assets/Instagram.png';
import hospitalImage from './Assets/hospital.jpg';
import produtoImage from './Assets/Produto2.png';
import appImage from './Assets/App.jpg';
import logoImage from './Assets/logo.png';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

const LandingPage = () => {
    const [openIndex, setOpenIndex] = useState(null); // Estado para controlar a pergunta aberta

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Alterna entre abrir e fechar
    };

    const news = [
        {
            title: 'Nova Parceria com Hospital HGC',
            description: 'A TechNurse acaba de fechar uma parceria com o Grupo Hospitalar Conceição.',
            image: hospitalImage,
        },
        {
            title: 'Lançamento do Novo App',
            description: 'Nosso novo aplicativo logo estará disponível para download na App Store e Google Play.',
            image: appImage,
        },
        {
            title: 'TechNurse no Tecnosinos',
            description: 'A TechNurse está no Tecnosinos, um dos maiores parques tecnológicos do Brasil.',
            image: 'https://www.tecnosinos.com.br/wp-content/uploads/2023/04/technurse.jpeg',
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const faqData = [
        {
            question: "O equipamento é resistente à água?",
            answer: "Sim, o equipamento possui certificação IP67, garantindo resistência à água e poeira.",
        },
        {
            question: "Qual a duração da bateria?",
            answer: "A bateria tem duração média de 48 horas, dependendo do uso.",
        },
        {
            question: "Como faço para conectar o equipamento ao aplicativo?",
            answer: "Basta baixar o aplicativo TechNurse, criar sua conta e seguir as instruções de pareamento no menu de configurações.",
        },
        {
            question: "O equipamento possui garantia?",
            answer: "Sim, oferecemos 12 meses de garantia contra defeitos de fabricação.",
        },
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <header className="header">
                <div className="header-container flex items-center">
                    <img src={logoImage} alt="Logo TechNurse" className="header-logo w-10 h-10 mr-2" />
                    <h1 className="logo text-lg font-bold">TechNurse</h1>
                    <Button className="header-button ml-auto">Entrar</Button>
                </div>
            </header>



            <section className="hero-section">
                <div className="hero-content">
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        Transformando a Saúde com Tecnologia
                    </motion.h1>
                    <p className="hero-description">
                        Nossa plataforma conecta pacientes e profissionais da saúde, promovendo atendimento rápido e eficiente.
                    </p>
                    <Button className="hero-button">Saiba Mais</Button>
                </div>
            </section>

            <section className="news-section">
                <div className="news-container">
                    <h2 className="section-title">Últimas Notícias</h2>
                    <Slider {...settings}>
                        {news.map((item, index) => (
                            <div key={index} className="news-slide">
                                <img src={item.image} alt={item.title} className="news-image" />
                                <div className="news-content">
                                    <h3 className="news-title">{item.title}</h3>
                                    <p className="news-description">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            <section className="hypertension-section">
                <h2 className="hypertension-title">Perigos da Hipertensão</h2>
                <p className="hypertension-text">
                    A hipertensão, também conhecida como pressão alta, é uma condição séria que pode aumentar o risco de doenças cardíacas, acidente vascular cerebral (AVC) e outros problemas de saúde. Ela ocorre quando a força do sangue contra as paredes das artérias é constantemente muito alta.
                    <br /><br />
                    É fundamental monitorar e controlar a pressão arterial regularmente para evitar complicações graves. Manter um estilo de vida saudável, praticar atividades físicas e reduzir o consumo de sal pode ajudar a controlar a hipertensão.
                </p>
                <div className="hypertension-statistics">
                    <div className="stat-item">
                        1 em cada 4
                        <p className="stat-description">adultos no mundo têm hipertensão.</p>
                    </div>
                    <div className="stat-item">
                        1,13 bilhões
                        <p className="stat-description">de pessoas no mundo sofrem de hipertensão.</p>
                    </div>
                    <div className="stat-item">
                        50%
                        <p className="stat-description">dos casos não são diagnosticados.</p>
                    </div>
                </div>
            </section>


            {/* Benefits Section */}
            <section id="benefits" className="benefits-section">
                <div className="benefits-container">
                    <h2 className="section-title">Benefícios</h2>
                    <div className="benefits-grid">
                        {[
                            {
                                title: 'Atendimento Rápido',
                                description: 'Encontre médicos disponíveis a qualquer hora e lugar.',
                            },
                            {
                                title: 'Acompanhamento Completo',
                                description: 'Mantenha todas as informações do paciente centralizadas.',
                            },
                            {
                                title: 'Segurança de Dados',
                                description: 'Garantimos a privacidade das suas informações médicas.',
                            },
                            {
                                title: 'O que é um "Wearable"',
                                description: 'Dispositivos que ajudam no acompanhamento de saúde em tempo real.',
                            },
                        ].map((benefit, index) => (
                            <motion.div
                                key={index}
                                className="benefit-card"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <Card>
                                    <CardContent>
                                        <h3 className="benefit-title">{benefit.title}</h3>
                                        <p className="benefit-description">{benefit.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Section */}
            <section className="product-section">
                <div className="product-container">
                    <img
                        src={produtoImage}
                        alt="Imagem do Produto"
                        className="product-image"
                    />

                    <div className="product-content">
                        <h2 className="section-title">Nosso Produto</h2>
                        <p className="product-description">
                            Nossa solução é uma plataforma digital intuitiva que conecta pacientes e profissionais de saúde,
                            agilizando agendamentos e facilitando a troca de informações.
                        </p>
                        <Button className="product-button">Experimente Agora</Button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            {/* FAQ Section */}
            <section className="faq-section py-16 bg-gray-50 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="section-title text-3xl font-bold text-purple-600 mb-12">
                        Perguntas Frequentes
                    </h2>
                    <div className="faq-grid grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className="faq-card shadow-md rounded-2xl bg-orange-200 p-6 cursor-pointer"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {faq.question}
                                </h3>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        transition={{ duration: 0.3 }}
                                        className="faq-answer mt-4 text-gray-600"
                                    >
                                        {faq.answer}
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>




            {/* Team Section */}
            <section className="team-section py-16 bg-gray-50 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="section-title text-3xl font-bold text-purple-600 mb-12">Nossa Equipe</h2>
                    <div className="team-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'JANAINA AVANCINI PINHEIRO',
                                formation: 'Especialista em Cardiologia',
                                photo: JanainaPhoto,
                                instagram: 'https://www.instagram.com/avancinipinheirojanaina?igsh=MWVyMGczbTZxdHBkag==',
                                linkedin: 'https://www.linkedin.com/in/joaosilva',
                            },
                            {
                                name: 'AYAME GAMARRA',
                                formation: 'Especialista em Pediatria',
                                photo: AyamePhoto,
                                instagram: 'https://www.instagram.com/ayamerosa?igsh=MWs5bGE4MDE2ZGVoMQ==',
                                linkedin: 'https://www.linkedin.com/in/mariaoliveira',
                            },
                            {
                                name: 'DOUGLAS MELLO',
                                formation: 'Desenvolvedor de Sistemas',
                                photo: DouglasPhoto,
                                instagram: 'https://www.instagram.com/douglas_mello_22?igsh=MWhnNWxjc2pveG9kbQ==',
                                linkedin: 'https://www.linkedin.com/in/carlossantos',
                            },
                        ].map((member, index) => (
                            <Card key={index} className="team-card shadow-md">
                                <CardContent className="text-center">
                                    <img
                                        src={member.photo}
                                        alt={`Foto de ${member.name}`}
                                        className="member-photo rounded-full mx-auto mb-4 w-32 h-32 object-cover"
                                    />
                                    <h3 className="member-name text-xl font-semibold text-gray-800">
                                        {member.name}
                                    </h3>
                                    <p className="member-formation text-gray-600">{member.formation}</p>
                                    <div className="social-icons flex justify-center mt-4 space-x-4">
                                        <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                                            <img src={instagramImage} alt="Instagram" className="social-logo w-6 h-6" />
                                        </a>
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                            <img src={linkedinImage} alt="LinkedIn" className="social-logo w-6 h-6" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <div className="footer-container">
                    <p>&copy; 2025 Healthify. Todos os direitos reservados.</p>
                </div>


            </footer>
        </div>
    );
};

export default LandingPage;
