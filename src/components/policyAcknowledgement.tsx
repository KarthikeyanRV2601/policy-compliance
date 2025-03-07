const PolicyAcknowledgement = () => {
    return (
        <div className="policy-acknowledgement-container">
            <h2>Policy Acknowledgement</h2>
            <div className="policy-acknowledgement-item">
                <input type="checkbox" id="acknowledge" />
                <label htmlFor="acknowledge">I agree to abide by the policies</label>
            </div>
            <button>Submit</button>
        </div>
    );
};

export default PolicyAcknowledgement;
