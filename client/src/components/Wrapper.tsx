
type WrapperProps = {
    children: React.ReactNode
}

const Wrapper = ({children}: WrapperProps) => {
    return (
        <div className="p-5 ml-5">
            {children}
        </div>
    )
}

export default Wrapper;