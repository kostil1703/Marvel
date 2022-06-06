import { Component } from 'react';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/marvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class RandomChar extends Component {
    componentDidMount() {
        this.updateChar();
        this.marvelService = new MarvelService();
    }

    state = {
        char: {},
        loading: false,
        error: false,
    }

    marvelService = new MarvelService();

    toCorrectDescription = (char) => {
        let descr = char.description;
        char.description = (descr.length > 227) ?
                         `${descr.slice(0, 227)}...` :
                         descr || 'No information about this Character ('
        return char;
    }

    onCharLoaded = (char) => {
        this.setState
        ({
          char, 
          loading: false
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    updateChar = () => {
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true});
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        this.marvelService.getCharacter(id)
                          .then(this.toCorrectDescription)
                          .then(this.onCharLoaded)
                          .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ?  <View char = {char}/> : null;
        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    let {name, description, thumbnail, homepage, wiki} = char; 
    
    const imgStyle = {objectFit: 'cover'};

    if (thumbnail && thumbnail.includes('image_not_available.jpg')) {
        imgStyle.objectFit = 'unset';
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" 
                                 className="randomchar__img" 
                                 style = {imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage}  rel="noreferrer" target='_blank' className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki}  rel="noreferrer" target='_blank' className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;