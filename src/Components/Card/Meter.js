
import { range } from "d3-array";


class Meter extends Component {
    constructor(props) {
      super(props);

      this.calcNumberOfFilledSteps = this.calcNumberOfFilledSteps.bind(this)
    }

    calcNumberOfFilledSteps(){
        const step = this.props.maxVal / this.props.MaxSteps
        const filledSteps = Math.round(this.props.value / step)
        return filledSteps
    }

  
    render() {
        range(1,)
        if (this.props.data){
        return <div className="meter">
        </div>
        }
    }
      
  }
  export default Meter;