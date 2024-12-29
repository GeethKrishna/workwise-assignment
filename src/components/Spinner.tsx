export default function Spinner({background} : {background: string}) {
    return (
      <div className={`fixed inset-0 ${background === 'white' ? 'bg-white' : 'bg-black/30'} flex items-center justify-center z-50`}>
        <div
            className={`
                inline-block h-8 w-8 animate-spin
                rounded-full border-4 border-solid border-r-transparent
                align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]
                ${background === 'white' ? 'border-black' : 'border-white'}
            `}
            role="status"
        >
          {" "}
        </div>
      </div>
    );
}