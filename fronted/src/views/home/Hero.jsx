import logo from "../../assets/logos/logo-transparente.png";
// 🔥 Importamos el hook de traducción
import { useTranslation } from 'react-i18next';

const Hero = () => {
    // 🔥 Iniciamos el traductor
    const { t } = useTranslation("global");

    return (
        <header className="heroSection">
            <div className="heroOverlay"></div>

            <img className="logo-inicio" src={logo} alt="Logo Alicia Teté" />
            
            {/* 🔥 Reemplazamos los textos fijos */}
            <p className="beforeTitle">
                {t("hero.beforeTitle")}
            </p>
            
            <h1 className="titleHome">
                {t("hero.title")}
            </h1>
            
            <p className="subtitleHome">
                {t("hero.subtitle")}
            </p>

            <div className="heroGradientBottom" />
        </header>
    );
};

export default Hero;