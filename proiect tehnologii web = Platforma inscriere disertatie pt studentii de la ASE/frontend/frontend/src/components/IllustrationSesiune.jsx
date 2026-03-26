function IllustrationSesiune() {
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <img
                src="/session-illustration.jpg"
                alt="Ilustrație creare sesiune"
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
}

export default IllustrationSesiune;
