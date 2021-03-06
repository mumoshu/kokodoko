class QuizzesController < ApplicationController
  nested_layout
  before_filter :authorize, \
  :only => [:new, :edit, :create, :update, :destroy]

  # GET /quizzes
  # GET /quizzes.xml
  def index
    @quizzes = Quiz.find(:all)
    @users = User.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @quizzes }
    end
  end

  # GET /quizzes/1
  # GET /quizzes/1.xml
  def show
    @quiz = Quiz.find(params[:id])
    @marks = @quiz.marks
    @quiz.num_accesses += 1;
    @quiz.save

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @quiz }
    end
  end

  # GET /quizzes/new
  # GET /quizzes/new.xml
  def new
    @quiz = Quiz.new
    @quiz.magnify_scale = 17
    @quiz.normal_scale = 16
    @quiz.demagnify_scale = 15
    @quiz.num_questions = 10

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @quiz }
    end
  end

  # GET /quizzes/1/edit
  def edit
    @quiz = Quiz.find(params[:id])
  end

  # POST /quizzes
  # POST /quizzes.xml
  def create
    @quiz = Quiz.new(params[:quiz])
    @quiz.user = session[:user_id]

    respond_to do |format|
      if @quiz.save
        flash[:notice] = 'Quiz was successfully created.'
        format.html { redirect_to(edit_quiz_path(@quiz)) }
        format.xml  { render :xml => @quiz, :status => :created, :location => @quiz }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @quiz.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /quizzes/1
  # PUT /quizzes/1.xml
  def update
    @quiz = Quiz.find(params[:id])

    respond_to do |format|
      if @quiz.update_attributes(params[:quiz])
        flash[:notice] = 'Quiz was successfully updated.'
        format.html { redirect_to(@quiz) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @quiz.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /quizzes/1
  # DELETE /quizzes/1.xml
  def destroy
    @quiz = Quiz.find(params[:id])
    @quiz.destroy

    respond_to do |format|
      format.html { redirect_to(quizzes_url) }
      format.xml  { head :ok }
    end
  end

  def send_score
    @score = Score.new(params[:score])
    
    render :text => params.inspect
  end
end
