import logo from '~/assets/logo.png';

export function Logo({width = "200px"}: {width?: string}) {
    return <img src={logo} width={width} alt="Seneca Logo" />;
}