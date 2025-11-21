const navigate = useNavigate();

const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
        navigate('/login');
        return;
    }

    setVoting(true);
    try {
        await onVote();
    } catch (error) {
        console.error('Vote error:', error);
    } finally {
        setVoting(false);
    }
};

return (
    <button
        className={`${styles.voteButton} ${isMobile ? styles.mobileVoteButton : ''}`}
        onClick={handleVote}
        disabled={currentUser && (!canVote || voting)}
    >
        {!currentUser ? (
            <>
                <Login sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
                {isMobile ? 'Sign in' : 'Sign in to Vote'}
            </>
        ) : voting ? (
            <>Voting...</>
        ) : canVote ? (
            <>
                <FavoriteBorder sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
                {isMobile ? 'Vote' : 'Vote Now'}
            </>
        ) : (
            <>
                <AccessTime sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
                {isMobile ? 'Voted' : 'Voted'}
            </>
        )}
    </button>
);
};

export default VoteButton;
