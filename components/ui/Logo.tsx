import Image from 'next/image'

export default function Logo() {
  return (
    <div className='flex justify-center mt-5'>
        <div className="relative md:w-25 md:h-25 w-40 h-40">
            <Image fill alt='Logo' src='/THE-COFFEE-CUP.svg' loading="eager"/>
        </div>
    </div>
  )
}
